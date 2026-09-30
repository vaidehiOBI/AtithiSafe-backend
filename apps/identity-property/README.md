# Identity & Property Management

Owns who can access the system and how each hotel operates.

- Port: `4001` (GraphQL federation subgraph at `/graphql`)
- Database: `identity_property` (MongoDB, owned only by this service)

## Modules

| Module | Responsibility |
|---|---|
| `auth` | Staff login, tokens and sessions |
| `users` | Staff users |
| `roles` | Role-based permissions: hotel staff, property admin, chain admin, AtithiSafe operator |
| `organizations` | Hotel chains / organisations |
| `properties` | Properties and hotel departments |
| `memberships` | Staff memberships in properties / chains |
| `qr-access` | Guest QR creation, expiry and scan validation |
| `guest-sessions` | Guest session creation and selected language |
| `guest-contacts` | Guest emergency contacts |
| `consents` | Guest consent records |
| `property-settings` | Hotel phone, emergency contacts, operating hours |
| `sops` | SOP library and corporate policy configuration |
| `escalation-rules` | Escalation rules |
| `audit-logs` | Audit logs for configuration and permission changes |

## Collections

- `users`
- `roles`
- `organizations`
- `properties`
- `memberships`
- `qr_access_points`
- `guest_sessions`
- `guest_contacts`
- `consents`
- `property_settings`
- `sops`
- `escalation_rules`
- `audit_logs`
