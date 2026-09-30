import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { assertAccess, hasAccess, RequestContext, StaffRole } from '@app/common';
import { assertFound, validId } from '../../common/mongo';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { UpdatePropertySettingsInput } from './dto/update-property-settings.input';
import { PropertySettings, PropertySettingsDocument } from './schemas/property-setting.schema';

@Injectable()
export class PropertySettingsService {
  constructor(
    @InjectModel(PropertySettings.name) private readonly settings: Model<PropertySettings>,
    private readonly audit: AuditLogsService,
  ) {}

  /** Called when a property is created so every property always has settings. */
  createDefaults(propertyId: Types.ObjectId | string, organizationId: Types.ObjectId | string) {
    return this.settings.create({ propertyId, organizationId });
  }

  async getByPropertyId(propertyId: string): Promise<PropertySettingsDocument> {
    return assertFound(validId(propertyId) ? await this.settings.findOne({ propertyId }) : null, 'Property settings');
  }

  /** Staff of the property, the guest staying there, or another service. */
  async findForProperty(ctx: RequestContext, propertyId: string) {
    const settings = await this.getByPropertyId(propertyId);
    const guestHere = ctx.kind === 'guest' && ctx.guest?.propertyId === propertyId;
    if (!guestHere && !hasAccess(ctx, settings, StaffRole.HOTEL_STAFF)) throw new ForbiddenException();
    return settings;
  }

  async update(ctx: RequestContext, propertyId: string, input: UpdatePropertySettingsInput) {
    const settings = await this.getByPropertyId(propertyId);
    assertAccess(ctx, settings, StaffRole.PROPERTY_ADMIN);

    const supported = input.supportedLanguages ?? settings.supportedLanguages;
    const defaultLanguage = input.defaultLanguage ?? settings.defaultLanguage;
    if (!supported.includes(defaultLanguage)) throw new BadRequestException('defaultLanguage must be one of supportedLanguages');
    for (const h of input.operatingHours ?? []) {
      if (!h.closed && (!h.opensAt || !h.closesAt)) throw new BadRequestException('opensAt and closesAt are required unless closed');
    }

    settings.set(input);
    await settings.save();
    await this.audit.record(ctx, {
      action: 'property_settings.updated',
      entityType: 'PropertySettings',
      entityId: settings.id,
      organizationId: settings.organizationId,
      propertyId: settings.propertyId,
      changes: { ...input },
    });
    return settings;
  }
}
