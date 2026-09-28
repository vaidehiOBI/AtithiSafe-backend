/** Cross-service domain event names (async communication between services). */
export const DomainEvents = {
  GUEST_SESSION_STARTED: 'identity.guest_session.started',
  INCIDENT_CREATED: 'safety.incident.created',
  INCIDENT_ESCALATED: 'safety.incident.escalated',
  INCIDENT_RESOLVED: 'safety.incident.resolved',
  CHECK_IN_MISSED: 'safety.journey.check_in_missed',
  NOTIFICATION_FAILED: 'comms.notification.failed',
} as const;

export type DomainEvent = (typeof DomainEvents)[keyof typeof DomainEvents];
