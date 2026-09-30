import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IncidentTimelineEvent, IncidentTimelineEventSchema } from './schemas/incident-timeline-event.schema';
import { IncidentTimelineResolver } from './incident-timeline.resolver';
import { IncidentTimelineService } from './incident-timeline.service';

/** Incident timeline and staff actions */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: IncidentTimelineEvent.name, schema: IncidentTimelineEventSchema },
    ]),
  ],
  providers: [IncidentTimelineResolver, IncidentTimelineService],
  exports: [IncidentTimelineService],
})
export class IncidentTimelineModule {}
