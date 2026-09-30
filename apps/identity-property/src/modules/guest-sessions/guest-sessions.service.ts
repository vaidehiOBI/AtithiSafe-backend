import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { assertAccess, GuestTokenPayload, hasAccess, isGuestOf, RequestContext, StaffRole } from '@app/common';
import { assertFound, validId } from '../../common/mongo';
import { ConsentsService } from '../consents/consents.service';
import { ConsentType } from '../consents/schemas/consent.schema';
import { PropertiesService } from '../properties/properties.service';
import { PropertySettingsService } from '../property-settings/property-settings.service';
import { QrAccessService } from '../qr-access/qr-access.service';
import { GuestSessionsArgs, StartGuestSessionInput, UpdateGuestSessionInput } from './dto/guest-session.types';
import { GuestSession, GuestSessionDocument, GuestSessionStatus } from './schemas/guest-session.schema';

const HOUR_MS = 60 * 60 * 1000;

@Injectable()
export class GuestSessionsService {
  constructor(
    @InjectModel(GuestSession.name) private readonly sessions: Model<GuestSession>,
    private readonly qrAccess: QrAccessService,
    private readonly settings: PropertySettingsService,
    private readonly properties: PropertiesService,
    private readonly consents: ConsentsService,
    private readonly jwt: JwtService,
  ) {}

  /** Public: QR scan -> guest session + guest token. */
  async start(input: StartGuestSessionInput) {
    const qr = await this.qrAccess.check(input.qrCode);
    if (!qr.valid) throw new BadRequestException(`QR code is not valid (${qr.reason})`);

    const settings = await this.settings.getByPropertyId(qr.property.id);
    const expiresAt = new Date(Date.now() + settings.guestSessionTtlHours * HOUR_MS);
    const { qrCode, acceptedPolicyVersion, ...details } = input;

    const session = await this.sessions.create({
      ...details,
      propertyId: qr.property._id,
      organizationId: qr.property.organizationId,
      qrAccessPointId: qr.qr._id,
      expiresAt,
    });
    await this.consents.record(session, { type: ConsentType.DATA_PROCESSING, granted: true, policyVersion: acceptedPolicyVersion });

    return { guestToken: await this.issueToken(session), session };
  }

  async getById(id: string): Promise<GuestSessionDocument> {
    return assertFound(validId(id) ? await this.sessions.findById(id) : null, 'Guest session');
  }

  /** Contract for Safety Operations: getGuestSession(id). The guest themself, property staff, or a service. */
  async findOne(ctx: RequestContext, id: string) {
    const session = await this.getById(id);
    if (!isGuestOf(ctx, session.id) && !hasAccess(ctx, session, StaffRole.HOTEL_STAFF)) throw new ForbiddenException();
    return session;
  }

  /** The calling guest's session; rejects ended or expired sessions. */
  async requireActiveForGuest(ctx: RequestContext): Promise<GuestSessionDocument> {
    const sessionId = ctx.kind === 'guest' ? ctx.guest?.sessionId : undefined;
    const session = sessionId && validId(sessionId) ? await this.sessions.findById(sessionId) : null;
    if (!session || session.status !== GuestSessionStatus.ACTIVE || session.expiresAt <= new Date()) {
      throw new UnauthorizedException('Guest session has ended; please scan the QR code again');
    }
    return session;
  }

  async list(ctx: RequestContext, args: GuestSessionsArgs) {
    const property = await this.properties.getById(args.propertyId);
    assertAccess(ctx, this.properties.target(property), StaffRole.HOTEL_STAFF);

    const filter: FilterQuery<GuestSession> = { propertyId: property._id };
    const now = new Date();
    if (args.status === GuestSessionStatus.ACTIVE) Object.assign(filter, { status: GuestSessionStatus.ACTIVE, expiresAt: { $gt: now } });
    if (args.status === GuestSessionStatus.EXPIRED) Object.assign(filter, { status: GuestSessionStatus.ACTIVE, expiresAt: { $lte: now } });
    if (args.status === GuestSessionStatus.ENDED) filter.status = GuestSessionStatus.ENDED;

    return this.sessions.find(filter).sort({ createdAt: -1 }).skip(args.offset).limit(args.limit);
  }

  async updateOwn(ctx: RequestContext, input: UpdateGuestSessionInput) {
    const session = await this.requireActiveForGuest(ctx);
    session.set(input);
    return session.save();
  }

  /** Guest checks out, or staff close the session (e.g. guest left). */
  async end(ctx: RequestContext, id: string) {
    const session = await this.getById(id);
    if (!isGuestOf(ctx, session.id)) assertAccess(ctx, session, StaffRole.HOTEL_STAFF);
    if (session.status === GuestSessionStatus.ENDED) return session;
    session.status = GuestSessionStatus.ENDED;
    session.endedAt = new Date();
    return session.save();
  }

  private issueToken(session: GuestSessionDocument) {
    const payload: GuestTokenPayload = {
      typ: 'guest',
      sub: session.id,
      propertyId: session.propertyId.toString(),
      organizationId: session.organizationId.toString(),
    };
    const expiresIn = Math.max(1, Math.floor((session.expiresAt.getTime() - Date.now()) / 1000));
    return this.jwt.signAsync(payload, { expiresIn });
  }
}
