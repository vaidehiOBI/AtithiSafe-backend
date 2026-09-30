import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConsentsModule } from '../consents/consents.module';
import { GuestContactsModule } from '../guest-contacts/guest-contacts.module';
import { PropertiesModule } from '../properties/properties.module';
import { PropertySettingsModule } from '../property-settings/property-settings.module';
import { QrAccessModule } from '../qr-access/qr-access.module';
import { GuestSessionsResolver } from './guest-sessions.resolver';
import { GuestSessionsService } from './guest-sessions.service';
import { GuestSession, GuestSessionSchema } from './schemas/guest-session.schema';

/** Guest session creation, selected language, and the guest-facing contacts / consent API */
@Module({
  imports: [
    MongooseModule.forFeature([{ name: GuestSession.name, schema: GuestSessionSchema }]),
    QrAccessModule,
    PropertySettingsModule,
    PropertiesModule,
    GuestContactsModule,
    ConsentsModule,
  ],
  providers: [GuestSessionsResolver, GuestSessionsService],
  exports: [GuestSessionsService],
})
export class GuestSessionsModule {}
