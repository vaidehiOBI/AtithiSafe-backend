import { registerEnumType } from '@nestjs/graphql';

export enum StaffRole {
  HOTEL_STAFF = 'HOTEL_STAFF',
  PROPERTY_ADMIN = 'PROPERTY_ADMIN',
  CHAIN_ADMIN = 'CHAIN_ADMIN',
  ATITHISAFE_OPERATOR = 'ATITHISAFE_OPERATOR',
}

registerEnumType(StaffRole, { name: 'StaffRole' });

/** Higher rank includes the permissions of lower ranks within its scope. */
export const STAFF_ROLE_RANK: Record<StaffRole, number> = {
  [StaffRole.HOTEL_STAFF]: 1,
  [StaffRole.PROPERTY_ADMIN]: 2,
  [StaffRole.CHAIN_ADMIN]: 3,
  [StaffRole.ATITHISAFE_OPERATOR]: 4,
};
