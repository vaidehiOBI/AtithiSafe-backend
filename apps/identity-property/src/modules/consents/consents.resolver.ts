import { Resolver } from '@nestjs/graphql';
import { ConsentsService } from './consents.service';

@Resolver()
export class ConsentsResolver {
  constructor(private readonly consentsService: ConsentsService) {}
}
