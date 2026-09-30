import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CurrentUser, RequestContext } from '@app/common';
import { User } from '../users/schemas/user.schema';
import { AssignMembershipInput, MembershipsArgs } from './dto/membership.inputs';
import { MembershipsService } from './memberships.service';
import { Membership } from './schemas/membership.schema';

@Resolver(() => Membership)
export class MembershipsResolver {
  constructor(
    private readonly membershipsService: MembershipsService,
    @InjectModel(User.name) private readonly users: Model<User>,
  ) {}

  @Query(() => [Membership], { description: 'Staff of a property (property admins) or organisation (chain admins)' })
  memberships(@CurrentUser() ctx: RequestContext, @Args() args: MembershipsArgs) {
    return this.membershipsService.list(ctx, args);
  }

  @Mutation(() => Membership, { description: 'Grant an existing user a role. You can only grant roles you hold over that scope.' })
  assignMembership(@CurrentUser() ctx: RequestContext, @Args('input') input: AssignMembershipInput) {
    return this.membershipsService.assign(ctx, input);
  }

  @Mutation(() => Membership)
  revokeMembership(@CurrentUser() ctx: RequestContext, @Args('id', { type: () => ID }) id: string) {
    return this.membershipsService.revoke(ctx, id);
  }

  @ResolveField(() => User)
  user(@Parent() membership: Membership) {
    return this.users.findById(membership.userId);
  }
}
