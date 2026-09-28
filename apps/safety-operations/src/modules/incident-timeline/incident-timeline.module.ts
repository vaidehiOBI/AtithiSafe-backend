import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncidentTimelineEvent } from './entities/incident-timeline-event.entity';
import { IncidentTimelineResolver } from './incident-timeline.resolver';
import { IncidentTimelineService } from './incident-timeline.service';

/** Incident timeline and staff actions */
@Module({
  imports: [TypeOrmModule.forFeature([IncidentTimelineEvent])],
  providers: [IncidentTimelineResolver, IncidentTimelineService],
  exports: [IncidentTimelineService],
})
export class IncidentTimelineModule {}
