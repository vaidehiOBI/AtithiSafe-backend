import { Resolver } from '@nestjs/graphql';
import { ProviderVerificationsService } from './provider-verifications.service';

@Resolver()
export class ProviderVerificationsResolver {
  constructor(private readonly providerVerificationsService: ProviderVerificationsService) {}
}
