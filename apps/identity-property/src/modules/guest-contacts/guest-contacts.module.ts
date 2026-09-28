import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuestContact } from './entities/guest-contact.entity';
import { GuestContactsResolver } from './guest-contacts.resolver';
import { GuestContactsService } from './guest-contacts.service';

/** Guest emergency contacts */
@Module({
  imports: [TypeOrmModule.forFeature([GuestContact])],
  providers: [GuestContactsResolver, GuestContactsService],
  exports: [GuestContactsService],
})
export class GuestContactsModule {}
