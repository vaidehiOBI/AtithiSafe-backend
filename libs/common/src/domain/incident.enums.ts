import { registerEnumType } from '@nestjs/graphql';

/** Shared contract: used by SOPs / escalation rules here and by incidents in Safety Operations. */
export enum IncidentCategory {
  EMERGENCY = 'EMERGENCY',
  MEDICAL = 'MEDICAL',
  LOST_PASSPORT = 'LOST_PASSPORT',
  SCAM = 'SCAM',
  THEFT = 'THEFT',
  TRANSPORT = 'TRANSPORT',
  HARASSMENT = 'HARASSMENT',
  OTHER = 'OTHER',
}

export enum IncidentSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

registerEnumType(IncidentCategory, { name: 'IncidentCategory' });
registerEnumType(IncidentSeverity, { name: 'IncidentSeverity' });
