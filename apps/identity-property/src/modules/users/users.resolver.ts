import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver, ResolveReference } from '@nestjs/graphql';
import { AllowGuest, AllowService, CurrentUser, RequestContext } from '@app/common';
import { MembershipsService } from '../memberships/memberships.service';
import { Membership } from '../memberships/schemas/membership.schema';
import { CreateStaffUserInput, UpdateUserInput, UsersArgs } from './dto/user.inputs';
import { User, UserStatus } from './schemas/user.schema';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly membershipsService: MembershipsService,
  ) {}

  @AllowService()
  @Query(() => User)
  user(@CurrentUser() ctx: RequestContext, @Args('id', { type: () => ID }) id: string) {
    return this.usersService.findOne(ctx, id);
  }

  @Query(() => [User], { description: 'Staff of a property (property admins) or organisation (chain admins)' })
  users(@CurrentUser() ctx: RequestContext, @Args() args: UsersArgs) {
    return this.usersService.list(ctx, args);
  }

  @Mutation(() => User, { description: 'Create a staff account together with its first role' })
  createStaffUser(@CurrentUser() ctx: RequestContext, @Args('input') input: CreateStaffUserInput) {
    return this.usersService.createStaffUser(ctx, input);
  }

  @Mutation(() => User)
  updateUser(@CurrentUser() ctx: RequestContext, @Args('id', { type: () => ID }) id: string, @Args('input') input: UpdateUserInput) {
    return this.usersService.update(ctx, id, input);
  }

  @Mutation(() => User, { description: 'Disable or re-enable a staff account' })
  setUserStatus(
    @CurrentUser() ctx: RequestContext,
    @Args('id', { type: () => ID }) id: string,
    @Args('status', { type: () => UserStatus }) status: UserStatus,
  ) {
    return this.usersService.setStatus(ctx, id, status);
  }

  @ResolveField(() => [Membership], { description: 'Active roles' })
  memberships(@Parent() user: User) {
    return this.membershipsService.activeForUser(user.id);
  }

  @AllowGuest()
  @AllowService()
  @ResolveReference()
  resolveReference(ref: { id: string }) {
    return this.usersService.getById(ref.id);
  }
}
