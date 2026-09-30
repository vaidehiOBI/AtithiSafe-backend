import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProviderVerification, ProviderVerificationSchema } from './schemas/provider-verification.schema';
import { ProviderVerificationsResolver } from './provider-verifications.resolver';
import { ProviderVerificationsService } from './provider-verifications.service';

/** Provider verification, suspension / rejection */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProviderVerification.name, schema: ProviderVerificationSchema },
    ]),
  ],
  providers: [ProviderVerificationsResolver, ProviderVerificationsService],
  exports: [ProviderVerificationsService],
})
export class ProviderVerificationsModule {}
