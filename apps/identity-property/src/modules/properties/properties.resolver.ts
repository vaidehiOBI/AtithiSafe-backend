import { Resolver } from '@nestjs/graphql';
import { PropertiesService } from './properties.service';

@Resolver()
export class PropertiesResolver {
  constructor(private readonly propertiesService: PropertiesService) {}
}
