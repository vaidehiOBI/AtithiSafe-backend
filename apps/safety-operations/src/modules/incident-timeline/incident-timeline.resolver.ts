import { Resolver } from '@nestjs/graphql';
import { IncidentTimelineService } from './incident-timeline.service';

@Resolver()
export class IncidentTimelineResolver {
  constructor(private readonly incidentTimelineService: IncidentTimelineService) {}
}
