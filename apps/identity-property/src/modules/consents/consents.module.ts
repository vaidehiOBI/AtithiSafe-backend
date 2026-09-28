import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consent } from './entities/consent.entity';
import { ConsentsResolver } from './consents.resolver';
import { ConsentsService } from './consents.service';

/** Guest consent records */
@Module({
  imports: [TypeOrmModule.forFeature([Consent])],
  providers: [ConsentsResolver, ConsentsService],
  exports: [ConsentsService],
})
export class ConsentsModule {}
