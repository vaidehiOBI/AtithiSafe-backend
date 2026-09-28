import { Resolver } from '@nestjs/graphql';
import { IncidentsService } from './incidents.service';

@Resolver()
export class IncidentsResolver {
  constructor(private readonly incidentsService: IncidentsService) {}
}
