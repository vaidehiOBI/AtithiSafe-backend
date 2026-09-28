import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncidentEscalation } from './entities/incident-escalation.entity';
import { EscalationsResolver } from './escalations.resolver';
import { EscalationsService } from './escalations.service';

/** Incident escalation (rules come from Identity & Property) */
@Module({
  imports: [TypeOrmModule.forFeature([IncidentEscalation])],
  providers: [EscalationsResolver, EscalationsService],
  exports: [EscalationsService],
})
export class EscalationsModule {}
