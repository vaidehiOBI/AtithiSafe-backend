import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JourneyCheckIn, JourneyCheckInSchema } from './schemas/journey-check-in.schema';
import { CheckInsResolver } from './check-ins.resolver';
import { CheckInsService } from './check-ins.service';

/** Journey check-ins and missed-check-in escalation */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: JourneyCheckIn.name, schema: JourneyCheckInSchema },
    ]),
  ],
  providers: [CheckInsResolver, CheckInsService],
  exports: [CheckInsService],
})
export class CheckInsModule {}
