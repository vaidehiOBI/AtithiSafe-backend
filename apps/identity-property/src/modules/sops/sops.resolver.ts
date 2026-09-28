import { Resolver } from '@nestjs/graphql';
import { SopsService } from './sops.service';

@Resolver()
export class SopsResolver {
  constructor(private readonly sopsService: SopsService) {}
}
