import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { randomBytes } from 'node:crypto';
import { Model } from 'mongoose';
import * as QRCode from 'qrcode';
import { assertAccess, RequestContext, StaffRole } from '@app/common';
import { RecordStatus } from '../../common/enums';
import { assertFound, validId } from '../../common/mongo';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { PropertiesService } from '../properties/properties.service';
import { PropertyDocument } from '../properties/schemas/property.schema';
import { PropertySettingsService } from '../property-settings/property-settings.service';
import { CreateQrAccessPointInput, QrInvalidReason, QrValidationResult, UpdateQrAccessPointInput } from './dto/qr-access.types';
import { QrAccessPoint, QrAccessPointDocument } from './schemas/qr-access-point.schema';

export type QrCheck =
  | { valid: true; qr: QrAccessPointDocument; property: PropertyDocument }
  | { valid: false; reason: QrInvalidReason };

@Injectable()
export class QrAccessService {
  constructor(
    @InjectModel(QrAccessPoint.name) private readonly qrPoints: Model<QrAccessPoint>,
    private readonly properties: PropertiesService,
    private readonly settings: PropertySettingsService,
    private readonly audit: AuditLogsService,
    private readonly config: ConfigService,
  ) {}

  /** URL printed in the QR code; opens the traveller app's welcome screen. */
  scanUrl(qr: QrAccessPoint) {
    const base = this.config.get<string>('GUEST_APP_URL', 'http://localhost:3000').replace(/\/$/, '');
    return `${base}/welcome?qr=${encodeURIComponent(qr.code)}`;
  }

  qrImage(qr: QrAccessPoint) {
    return QRCode.toDataURL(this.scanUrl(qr), { errorCorrectionLevel: 'M', margin: 2, width: 512 });
  }

  async list(ctx: RequestContext, propertyId: string, includeInactive: boolean) {
    const property = await this.properties.getById(propertyId);
    assertAccess(ctx, this.properties.target(property), StaffRole.HOTEL_STAFF);
    return this.qrPoints.find({ propertyId: property._id, ...(!includeInactive && { isActive: true }) }).sort({ label: 1 });
  }

  async create(ctx: RequestContext, input: CreateQrAccessPointInput) {
    const property = await this.properties.getById(input.propertyId);
    assertAccess(ctx, this.properties.target(property), StaffRole.PROPERTY_ADMIN);
    assertFuture(input.expiresAt);

    const qr = await this.qrPoints.create({
      ...input,
      propertyId: property._id,
      organizationId: property.organizationId,
      code: randomBytes(18).toString('base64url'),
      createdBy: ctx.userId,
    });
    await this.audit.record(ctx, { action: 'qr_access_point.created', entityType: 'QrAccessPoint', entityId: qr.id, ...this.properties.target(property), changes: { ...input } });
    return qr;
  }

  async update(ctx: RequestContext, id: string, input: UpdateQrAccessPointInput) {
    const qr = await this.getManageable(ctx, id);
    assertFuture(input.expiresAt);
    qr.set(input);
    await qr.save();
    await this.audit.record(ctx, { action: 'qr_access_point.updated', entityType: 'QrAccessPoint', entityId: qr.id, organizationId: qr.organizationId, propertyId: qr.propertyId, changes: { ...input } });
    return qr;
  }

  async deactivate(ctx: RequestContext, id: string) {
    const qr = await this.getManageable(ctx, id);
    qr.isActive = false;
    await qr.save();
    await this.audit.record(ctx, { action: 'qr_access_point.deactivated', entityType: 'QrAccessPoint', entityId: qr.id, organizationId: qr.organizationId, propertyId: qr.propertyId });
    return qr;
  }

  /** Checks a scanned code without side effects. */
  async check(code: string): Promise<QrCheck> {
    const qr = await this.qrPoints.findOne({ code });
    if (!qr) return { valid: false, reason: QrInvalidReason.NOT_FOUND };
    if (!qr.isActive) return { valid: false, reason: QrInvalidReason.INACTIVE };
    if (qr.expiresAt && qr.expiresAt <= new Date()) return { valid: false, reason: QrInvalidReason.EXPIRED };
    const property = await this.properties.getById(qr.propertyId.toString());
    if (property.status !== RecordStatus.ACTIVE) return { valid: false, reason: QrInvalidReason.PROPERTY_INACTIVE };
    return { valid: true, qr, property };
  }

  /** Public: called when a guest opens the QR link. Counts the scan. */
  async validate(code: string): Promise<QrValidationResult> {
    const result = await this.check(code);
    if (!result.valid) return { valid: false, reason: result.reason };

    await this.qrPoints.updateOne({ _id: result.qr._id }, { $inc: { scanCount: 1 }, lastScannedAt: new Date() });
    const settings = await this.settings.getByPropertyId(result.property.id);
    return {
      valid: true,
      propertyId: result.property.id,
      propertyName: result.property.name,
      label: result.qr.label,
      supportedLanguages: settings.supportedLanguages,
      defaultLanguage: settings.defaultLanguage,
    };
  }

  private async getManageable(ctx: RequestContext, id: string) {
    const qr = assertFound(validId(id) ? await this.qrPoints.findById(id) : null, 'QR access point');
    assertAccess(ctx, qr, StaffRole.PROPERTY_ADMIN);
    return qr;
  }
}

function assertFuture(date?: Date) {
  if (date && date <= new Date()) throw new BadRequestException('expiresAt must be in the future');
}
