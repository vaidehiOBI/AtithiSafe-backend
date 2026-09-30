import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrganizationsModule } from '../organizations/organizations.module';
import { PropertiesModule } from '../properties/properties.module';
import { User, UserSchema } from '../users/schemas/user.schema';
import { MembershipsResolver } from './memberships.resolver';
import { MembershipsService } from './memberships.service';
import { Membership, MembershipSchema } from './schemas/membership.schema';

/** Staff memberships in properties / chains */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Membership.name, schema: MembershipSchema },
      { name: User.name, schema: UserSchema },
    ]),
    PropertiesModule,
    OrganizationsModule,
  ],
  providers: [MembershipsResolver, MembershipsService],
  exports: [MembershipsService],
})
export class MembershipsModule {}
