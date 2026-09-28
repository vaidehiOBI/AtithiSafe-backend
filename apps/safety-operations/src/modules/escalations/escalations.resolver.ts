import { Resolver } from '@nestjs/graphql';
import { EscalationsService } from './escalations.service';

@Resolver()
export class EscalationsResolver {
  constructor(private readonly escalationsService: EscalationsService) {}
}
