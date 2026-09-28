import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JourneyCheckIn } from './entities/journey-check-in.entity';
import { CheckInsResolver } from './check-ins.resolver';
import { CheckInsService } from './check-ins.service';

/** Journey check-ins and missed-check-in escalation */
@Module({
  imports: [TypeOrmModule.forFeature([JourneyCheckIn])],
  providers: [CheckInsResolver, CheckInsService],
  exports: [CheckInsService],
})
export class CheckInsModule {}
