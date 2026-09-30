import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IncidentEscalation, IncidentEscalationSchema } from './schemas/incident-escalation.schema';
import { EscalationsResolver } from './escalations.resolver';
import { EscalationsService } from './escalations.service';

/** Incident escalation (rules come from Identity & Property) */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: IncidentEscalation.name, schema: IncidentEscalationSchema },
    ]),
  ],
  providers: [EscalationsResolver, EscalationsService],
  exports: [EscalationsService],
})
export class EscalationsModule {}
