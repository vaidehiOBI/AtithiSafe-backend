import { Resolver } from '@nestjs/graphql';
import { ProviderDocumentsService } from './provider-documents.service';

@Resolver()
export class ProviderDocumentsResolver {
  constructor(private readonly providerDocumentsService: ProviderDocumentsService) {}
}
