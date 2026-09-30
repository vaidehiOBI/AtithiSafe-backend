import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ALLOW_GUEST_KEY, ALLOW_SERVICE_KEY, IS_PUBLIC_KEY } from './auth.decorators';
import { RequestContext } from './request-context';

/**
 * Global guard. Resolvers are staff-only unless marked @Public, @AllowGuest or @AllowService.
 * Role and scope checks happen in services via `assertAccess`, because they depend on the target record.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const flag = (key: string) => this.reflector.getAllAndOverride<boolean>(key, [context.getHandler(), context.getClass()]);
    if (flag(IS_PUBLIC_KEY)) return true;

    const user: RequestContext | undefined = GqlExecutionContext.create(context).getContext().user;
    switch (user?.kind) {
      case 'staff':
        return true;
      case 'guest':
        if (flag(ALLOW_GUEST_KEY)) return true;
        break;
      case 'service':
        if (flag(ALLOW_SERVICE_KEY)) return true;
        break;
    }
    throw new UnauthorizedException();
  }
}
