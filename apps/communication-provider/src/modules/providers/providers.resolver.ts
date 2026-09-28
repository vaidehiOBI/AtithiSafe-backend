import { Resolver } from '@nestjs/graphql';
import { ProvidersService } from './providers.service';

@Resolver()
export class ProvidersResolver {
  constructor(private readonly providersService: ProvidersService) {}
}
