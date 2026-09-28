import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProviderComplaint } from './entities/provider-complaint.entity';
import { ProviderComplaintsResolver } from './provider-complaints.resolver';
import { ProviderComplaintsService } from './provider-complaints.service';

/** Provider complaint records */
@Module({
  imports: [TypeOrmModule.forFeature([ProviderComplaint])],
  providers: [ProviderComplaintsResolver, ProviderComplaintsService],
  exports: [ProviderComplaintsService],
})
export class ProviderComplaintsModule {}
