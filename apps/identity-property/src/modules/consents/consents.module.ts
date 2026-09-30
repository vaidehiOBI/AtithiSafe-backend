import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConsentsResolver } from './consents.resolver';
import { ConsentsService } from './consents.service';
import { Consent, ConsentSchema } from './schemas/consent.schema';

/** Guest consent records (guests record consent through the GuestSession API) */
@Module({
  imports: [MongooseModule.forFeature([{ name: Consent.name, schema: ConsentSchema }])],
  providers: [ConsentsResolver, ConsentsService],
  exports: [ConsentsService],
})
export class ConsentsModule {}
