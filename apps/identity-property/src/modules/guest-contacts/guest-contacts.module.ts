import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GuestContactsService } from './guest-contacts.service';
import { GuestContact, GuestContactSchema } from './schemas/guest-contact.schema';

/** Guest emergency contacts (exposed through the GuestSession API) */
@Module({
  imports: [MongooseModule.forFeature([{ name: GuestContact.name, schema: GuestContactSchema }])],
  providers: [GuestContactsService],
  exports: [GuestContactsService],
})
export class GuestContactsModule {}
