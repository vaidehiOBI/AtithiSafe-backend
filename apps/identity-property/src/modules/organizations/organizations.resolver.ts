import { Resolver } from '@nestjs/graphql';
import { OrganizationsService } from './organizations.service';

@Resolver()
export class OrganizationsResolver {
  constructor(private readonly organizationsService: OrganizationsService) {}
}
