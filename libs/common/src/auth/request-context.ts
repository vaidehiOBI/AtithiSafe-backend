import { StaffRole } from './staff-role.enum';

export interface MembershipClaim {
  role: StaffRole;
  organizationId?: string;
  propertyId?: string;
}

export interface GuestClaim {
  sessionId: string;
  propertyId: string;
  organizationId: string;
}

/**
 * Who is making the request. Built by the gateway from the verified token and
 * forwarded to every service in the `x-auth-context` header.
 * `service` is a direct service-to-service call (e.g. Safety Operations -> Identity).
 */
export interface RequestContext {
  kind: 'anonymous' | 'staff' | 'guest' | 'service';
  userId?: string;
  memberships: MembershipClaim[];
  guest?: GuestClaim;
  serviceName?: string;
}

export const ANONYMOUS_CONTEXT: RequestContext = { kind: 'anonymous', memberships: [] };

export const CONTEXT_HEADERS = {
  authContext: 'x-auth-context',
  internalApiKey: 'x-internal-api-key',
  serviceName: 'x-service-name',
} as const;

export const encodeContext = (ctx: RequestContext): string =>
  Buffer.from(JSON.stringify(ctx)).toString('base64url');

/**
 * Headers are only trusted when they carry the shared internal API key, so a
 * client that reaches a service port directly cannot forge an identity.
 */
export function contextFromHeaders(
  headers: Record<string, string | string[] | undefined>,
  internalApiKey: string | undefined,
): RequestContext {
  const get = (name: string) => headers[name] as string | undefined;
  if (!internalApiKey || get(CONTEXT_HEADERS.internalApiKey) !== internalApiKey) return ANONYMOUS_CONTEXT;

  const encoded = get(CONTEXT_HEADERS.authContext);
  if (!encoded) return { kind: 'service', memberships: [], serviceName: get(CONTEXT_HEADERS.serviceName) ?? 'unknown' };

  try {
    const ctx = JSON.parse(Buffer.from(encoded, 'base64url').toString()) as RequestContext;
    return { ...ctx, memberships: ctx.memberships ?? [] };
  } catch {
    return ANONYMOUS_CONTEXT;
  }
}
