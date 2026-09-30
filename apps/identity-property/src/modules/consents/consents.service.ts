import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { hasAccess, isGuestOf, RequestContext, StaffRole } from '@app/common';
import { validId } from '../../common/mongo';
import { RecordConsentInput } from './dto/record-consent.input';
import { Consent, ConsentDocument, ConsentType } from './schemas/consent.schema';

interface SessionRef {
  _id: Types.ObjectId;
  propertyId: Types.ObjectId;
  organizationId: Types.ObjectId;
}

@Injectable()
export class ConsentsService {
  constructor(@InjectModel(Consent.name) private readonly consents: Model<Consent>) {}

  record(session: SessionRef, input: RecordConsentInput) {
    return this.consents.create({ ...input, guestSessionId: session._id, propertyId: session.propertyId, organizationId: session.organizationId });
  }

  /** Current decision for each consent type the guest has answered. */
  async currentForSession(guestSessionId: string | Types.ObjectId): Promise<ConsentDocument[]> {
    const history = await this.consents.find({ guestSessionId }).sort({ createdAt: -1, _id: -1 });
    const latest = new Map<ConsentType, ConsentDocument>();
    for (const c of history) if (!latest.has(c.type)) latest.set(c.type, c);
    return [...latest.values()];
  }

  history(guestSessionId: string | Types.ObjectId) {
    return this.consents.find({ guestSessionId }).sort({ createdAt: -1, _id: -1 });
  }

  /** Contract for Safety Operations, e.g. before sharing a guest's location. */
  async hasActiveConsent(ctx: RequestContext, guestSessionId: string, type: ConsentType): Promise<boolean> {
    if (!validId(guestSessionId)) return false;
    const latest = await this.consents.findOne({ guestSessionId, type }).sort({ createdAt: -1, _id: -1 });
    if (!latest) return false;
    if (!isGuestOf(ctx, guestSessionId) && !hasAccess(ctx, latest, StaffRole.HOTEL_STAFF)) throw new ForbiddenException();
    return latest.granted;
  }
}
