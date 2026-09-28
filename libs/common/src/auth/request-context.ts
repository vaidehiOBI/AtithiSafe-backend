import { StaffRole } from './staff-role.enum';

/** Identity resolved by the gateway and forwarded to every service as headers. */
export interface RequestContext {
  userId?: string;
  guestSessionId?: string;
  roles: StaffRole[];
  propertyIds: string[];
}

export const CONTEXT_HEADERS = {
  userId: 'x-user-id',
  guestSessionId: 'x-guest-session-id',
  roles: 'x-user-roles',
  propertyIds: 'x-property-ids',
} as const;

export function contextFromHeaders(headers: Record<string, string | string[] | undefined>): RequestContext {
  const get = (name: string) => (headers[name] as string | undefined) ?? '';
  return {
    userId: get(CONTEXT_HEADERS.userId) || undefined,
    guestSessionId: get(CONTEXT_HEADERS.guestSessionId) || undefined,
    roles: get(CONTEXT_HEADERS.roles).split(',').filter(Boolean) as StaffRole[],
    propertyIds: get(CONTEXT_HEADERS.propertyIds).split(',').filter(Boolean),
  };
}
