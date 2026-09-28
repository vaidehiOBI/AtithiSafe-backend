import { Resolver } from '@nestjs/graphql';
import { PropertySettingsService } from './property-settings.service';

@Resolver()
export class PropertySettingsResolver {
  constructor(private readonly propertySettingsService: PropertySettingsService) {}
}
