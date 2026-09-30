import { MembershipClaim } from './request-context';

/** JWT issued by Identity & Property to staff on login. */
export interface StaffTokenPayload {
  typ: 'staff';
  sub: string;
  memberships: MembershipClaim[];
}

/** JWT issued by Identity & Property to a guest when a QR scan starts a session. */
export interface GuestTokenPayload {
  typ: 'guest';
  sub: string;
  propertyId: string;
  organizationId: string;
}

export type TokenPayload = StaffTokenPayload | GuestTokenPayload;
