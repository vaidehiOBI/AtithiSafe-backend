# Safety Operations

Core service. Owns every safety case from creation to resolution.

- Port: `4002` (GraphQL federation subgraph at `/graphql`)
- Database: `safety_operations` (MongoDB, owned only by this service)

## Modules

| Module | Responsibility |
|---|---|
| `incidents` | Emergency alerts and incident reports; categories (medical, lost passport, scam, theft, transport, harassment); severity, status, resolution |
| `assignments` | Incident ownership and staff assignment |
| `escalations` | Incident escalation (rules come from Identity & Property) |
| `incident-timeline` | Incident timeline and staff actions |
| `sop-snapshots` | Recommended SOP lookup from Identity & Property; snapshot saved on the incident |
| `journeys` | Safe journeys |
| `vehicles` | Driver / vehicle records |
| `check-ins` | Journey check-ins and missed-check-in escalation |
| `location-sharing` | Temporary, consent-based guest location sharing |
| `evidence` | Evidence metadata and secure uploads (photos, documents, verification images) |
| `reports` | Dashboard / reporting read models for active incidents and property reports |

## Collections

- `incidents`
- `incident_assignments`
- `incident_escalations`
- `incident_timeline_events`
- `incident_sop_snapshots`
- `journeys`
- `vehicles`
- `journey_check_ins`
- `location_shares`
- `evidence_files`

## Integrations

- `integrations/identity-property` (IdentityPropertyClient): Calls Identity & Property (SOPs, escalation rules, consents)
- `integrations/storage` (StorageClient): Secure object storage for evidence uploads
