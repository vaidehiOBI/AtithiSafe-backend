import { Resolver } from '@nestjs/graphql';
import { JourneysService } from './journeys.service';

@Resolver()
export class JourneysResolver {
  constructor(private readonly journeysService: JourneysService) {}
}
