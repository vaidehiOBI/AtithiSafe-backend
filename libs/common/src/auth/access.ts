import { ForbiddenException } from '@nestjs/common';
import { RequestContext } from './request-context';
import { STAFF_ROLE_RANK, StaffRole } from './staff-role.enum';

/** What a request is trying to reach. Omit `propertyId` for organisation-level records. */
type IdLike = string | { toString(): string } | null | undefined;

export interface AccessTarget {
  organizationId?: IdLike;
  propertyId?: IdLike;
}

export const isOperator = (ctx: RequestContext) =>
  ctx.kind === 'staff' && ctx.memberships.some((m) => m.role === StaffRole.ATITHISAFE_OPERATOR);

/**
 * True when the caller holds at least `minRole` over the target:
 * operators everywhere, chain admins across their organisation, other roles on their property.
 * Direct service calls are trusted.
 */
export function hasAccess(ctx: RequestContext, target: AccessTarget, minRole: StaffRole): boolean {
  if (ctx.kind === 'service') return true;
  if (ctx.kind !== 'staff') return false;
  const orgId = target.organizationId?.toString();
  const propertyId = target.propertyId?.toString();

  return ctx.memberships.some((m) => {
    if (STAFF_ROLE_RANK[m.role] < STAFF_ROLE_RANK[minRole]) return false;
    if (m.role === StaffRole.ATITHISAFE_OPERATOR) return true;
    if (m.role === StaffRole.CHAIN_ADMIN) return !!orgId && m.organizationId === orgId;
    return !!propertyId && m.propertyId === propertyId;
  });
}

export function assertAccess(ctx: RequestContext, target: AccessTarget, minRole: StaffRole): void {
  if (!hasAccess(ctx, target, minRole)) throw new ForbiddenException('You do not have access to this resource');
}

export function assertOperator(ctx: RequestContext): void {
  if (!isOperator(ctx)) throw new ForbiddenException('AtithiSafe operator access required');
}

/** Guest calling about their own session. */
export const isGuestOf = (ctx: RequestContext, guestSessionId: IdLike) =>
  ctx.kind === 'guest' && !!guestSessionId && ctx.guest?.sessionId === guestSessionId.toString();
