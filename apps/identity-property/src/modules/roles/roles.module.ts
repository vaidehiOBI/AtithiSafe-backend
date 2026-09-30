import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesResolver } from './roles.resolver';
import { RolesService } from './roles.service';
import { Role, RoleSchema } from './schemas/role.schema';

/** Role-based permissions: hotel staff, property admin, chain admin, AtithiSafe operator */
@Module({
  imports: [MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }])],
  providers: [RolesResolver, RolesService],
  exports: [RolesService],
})
export class RolesModule {}
