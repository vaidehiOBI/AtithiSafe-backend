import { Query, Resolver } from '@nestjs/graphql';
import { RolesService } from './roles.service';
import { Role } from './schemas/role.schema';

@Resolver(() => Role)
export class RolesResolver {
  constructor(private readonly rolesService: RolesService) {}

  @Query(() => [Role], { description: 'Staff roles and the permissions each grants' })
  roles() {
    return this.rolesService.list();
  }
}
