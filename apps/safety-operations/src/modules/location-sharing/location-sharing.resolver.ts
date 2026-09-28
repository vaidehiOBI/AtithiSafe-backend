import { Resolver } from '@nestjs/graphql';
import { LocationSharingService } from './location-sharing.service';

@Resolver()
export class LocationSharingResolver {
  constructor(private readonly locationSharingService: LocationSharingService) {}
}
