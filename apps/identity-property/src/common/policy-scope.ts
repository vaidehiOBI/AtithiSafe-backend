import { BadRequestException } from '@nestjs/common';
import { registerEnumType } from '@nestjs/graphql';
import { assertAccess, assertOperator, RequestContext, StaffRole } from '@app/common';
import { PropertiesService } from '../modules/properties/properties.service';

/** Where a policy (SOP / escalation rule) applies. More specific scopes override broader ones. */
export enum PolicyScope {
  GLOBAL = 'GLOBAL',
  ORGANIZATION = 'ORGANIZATION',
  PROPERTY = 'PROPERTY',
}
registerEnumType(PolicyScope, { name: 'PolicyScope' });

export interface ResolvedPolicyScope {
  scope: PolicyScope;
  organizationId?: string;
  propertyId?: string;
}

/**
 * Derives the scope from the ids given and checks the caller may manage policies there:
 * property -> property admin, organisation (corporate policy) -> chain admin, global -> operator.
 */
export async function resolveManagedScope(
  ctx: RequestContext,
  properties: PropertiesService,
  ids: { organizationId?: string; propertyId?: string },
  allowGlobal: boolean,
): Promise<ResolvedPolicyScope> {
  if (ids.propertyId) {
    const property = await properties.getById(ids.propertyId);
    const target = properties.target(property);
    assertAccess(ctx, target, StaffRole.PROPERTY_ADMIN);
    return { scope: PolicyScope.PROPERTY, ...target };
  }
  if (ids.organizationId) {
    assertAccess(ctx, { organizationId: ids.organizationId }, StaffRole.CHAIN_ADMIN);
    return { scope: PolicyScope.ORGANIZATION, organizationId: ids.organizationId };
  }
  if (!allowGlobal) throw new BadRequestException('organizationId or propertyId is required');
  assertOperator(ctx);
  return { scope: PolicyScope.GLOBAL };
}

export function assertCanManagePolicy(ctx: RequestContext, policy: { scope: PolicyScope; organizationId?: unknown; propertyId?: unknown }) {
  const target = { organizationId: policy.organizationId?.toString(), propertyId: policy.propertyId?.toString() };
  if (policy.scope === PolicyScope.PROPERTY) assertAccess(ctx, target, StaffRole.PROPERTY_ADMIN);
  else if (policy.scope === PolicyScope.ORGANIZATION) assertAccess(ctx, target, StaffRole.CHAIN_ADMIN);
  else assertOperator(ctx);
}
