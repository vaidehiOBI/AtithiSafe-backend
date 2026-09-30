import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProviderComplaint, ProviderComplaintSchema } from './schemas/provider-complaint.schema';
import { ProviderComplaintsResolver } from './provider-complaints.resolver';
import { ProviderComplaintsService } from './provider-complaints.service';

/** Provider complaint records */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProviderComplaint.name, schema: ProviderComplaintSchema },
    ]),
  ],
  providers: [ProviderComplaintsResolver, ProviderComplaintsService],
  exports: [ProviderComplaintsService],
})
export class ProviderComplaintsModule {}
