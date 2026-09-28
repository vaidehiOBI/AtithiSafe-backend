import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProviderVerification } from './entities/provider-verification.entity';
import { ProviderVerificationsResolver } from './provider-verifications.resolver';
import { ProviderVerificationsService } from './provider-verifications.service';

/** Provider verification, suspension / rejection */
@Module({
  imports: [TypeOrmModule.forFeature([ProviderVerification])],
  providers: [ProviderVerificationsResolver, ProviderVerificationsService],
  exports: [ProviderVerificationsService],
})
export class ProviderVerificationsModule {}
