import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser, Public, RequestContext } from '@app/common';
import { User } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { AuthPayload, ChangePasswordInput, LoginInput } from './dto/auth.types';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Public()
  @Mutation(() => AuthPayload, { description: 'Staff login. Role changes take effect on next login.' })
  login(@Args('input') input: LoginInput) {
    return this.authService.login(input);
  }

  @Query(() => User, { description: 'The signed-in staff user' })
  me(@CurrentUser() ctx: RequestContext) {
    return this.usersService.getById(ctx.userId!);
  }

  @Mutation(() => Boolean)
  changePassword(@CurrentUser() ctx: RequestContext, @Args('input') input: ChangePasswordInput) {
    return this.usersService.changePassword(ctx, input.currentPassword, input.newPassword);
  }
}
