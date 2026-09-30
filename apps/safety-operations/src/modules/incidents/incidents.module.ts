import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Incident, IncidentSchema } from './schemas/incident.schema';
import { IncidentsResolver } from './incidents.resolver';
import { IncidentsService } from './incidents.service';

/** Emergency alerts and incident reports; categories (medical, lost passport, scam, theft, transport, harassment); severity, status, resolution */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Incident.name, schema: IncidentSchema },
    ]),
  ],
  providers: [IncidentsResolver, IncidentsService],
  exports: [IncidentsService],
})
export class IncidentsModule {}
