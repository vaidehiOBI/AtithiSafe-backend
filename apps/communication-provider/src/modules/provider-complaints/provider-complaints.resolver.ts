import { Resolver } from '@nestjs/graphql';
import { ProviderComplaintsService } from './provider-complaints.service';

@Resolver()
export class ProviderComplaintsResolver {
  constructor(private readonly providerComplaintsService: ProviderComplaintsService) {}
}
