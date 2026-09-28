import { Resolver } from '@nestjs/graphql';
import { EvidenceService } from './evidence.service';

@Resolver()
export class EvidenceResolver {
  constructor(private readonly evidenceService: EvidenceService) {}
}
