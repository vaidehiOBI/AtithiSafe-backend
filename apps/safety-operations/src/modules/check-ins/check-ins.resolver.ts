import { Resolver } from '@nestjs/graphql';
import { CheckInsService } from './check-ins.service';

@Resolver()
export class CheckInsResolver {
  constructor(private readonly checkInsService: CheckInsService) {}
}
