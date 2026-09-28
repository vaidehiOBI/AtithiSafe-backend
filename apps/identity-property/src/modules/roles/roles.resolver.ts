import { Resolver } from '@nestjs/graphql';
import { RolesService } from './roles.service';

@Resolver()
export class RolesResolver {
  constructor(private readonly rolesService: RolesService) {}
}
