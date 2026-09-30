import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { assertFound, validId } from '../../common/mongo';
import { AddGuestContactInput } from './dto/add-guest-contact.input';
import { GuestContact } from './schemas/guest-contact.schema';

const MAX_CONTACTS_PER_SESSION = 5;

interface SessionRef {
  _id: Types.ObjectId;
  propertyId: Types.ObjectId;
  organizationId: Types.ObjectId;
}

/** Data access only; guest-facing mutations and access checks live in GuestSessionsResolver. */
@Injectable()
export class GuestContactsService {
  constructor(@InjectModel(GuestContact.name) private readonly contacts: Model<GuestContact>) {}

  listForSession(guestSessionId: string | Types.ObjectId) {
    return this.contacts.find({ guestSessionId }).sort({ createdAt: 1 });
  }

  async add(session: SessionRef, input: AddGuestContactInput) {
    const count = await this.contacts.countDocuments({ guestSessionId: session._id });
    if (count >= MAX_CONTACTS_PER_SESSION) throw new BadRequestException(`At most ${MAX_CONTACTS_PER_SESSION} emergency contacts per stay`);
    return this.contacts.create({ ...input, guestSessionId: session._id, propertyId: session.propertyId, organizationId: session.organizationId });
  }

  async remove(guestSessionId: Types.ObjectId, contactId: string) {
    const contact = assertFound(validId(contactId) ? await this.contacts.findOneAndDelete({ _id: contactId, guestSessionId }) : null, 'Contact');
    return contact;
  }
}
