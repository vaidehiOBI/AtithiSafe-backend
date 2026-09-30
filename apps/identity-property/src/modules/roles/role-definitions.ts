import { StaffRole } from '@app/common';

const HOTEL_STAFF = [
  'incident:view',
  'incident:respond',
  'guest_session:view',
  'property:view',
  'sop:view',
  'escalation_rule:view',
];
const PROPERTY_ADMIN = [
  ...HOTEL_STAFF,
  'property:manage',
  'property_settings:manage',
  'staff:manage',
  'qr_access:manage',
  'sop:manage',
  'escalation_rule:manage',
  'audit_log:view',
];
const CHAIN_ADMIN = [...PROPERTY_ADMIN, 'organization:manage', 'property:create', 'corporate_policy:manage'];
const OPERATOR = [...CHAIN_ADMIN, 'organization:create', 'global_sop:manage', 'provider:verify'];

export const ROLE_DEFINITIONS = [
  { key: StaffRole.HOTEL_STAFF, name: 'Hotel staff', description: 'Front desk, security, concierge and duty managers at one property.', permissions: HOTEL_STAFF },
  { key: StaffRole.PROPERTY_ADMIN, name: 'Property admin', description: 'Configures staff, SOPs, escalation, QR access and settings for one property.', permissions: PROPERTY_ADMIN },
  { key: StaffRole.CHAIN_ADMIN, name: 'Chain admin', description: 'Manages all properties and corporate policy of an organisation.', permissions: CHAIN_ADMIN },
  { key: StaffRole.ATITHISAFE_OPERATOR, name: 'AtithiSafe operator', description: 'AtithiSafe central operations with platform-wide access.', permissions: OPERATOR },
];
