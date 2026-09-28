# Communication & Provider

Handles communication with the guest and manages trusted local providers.

- Port: `4003` (GraphQL federation subgraph at `/graphql`)
- Database: `communication_provider` (PostgreSQL, owned only by this service)

## Modules

| Module | Responsibility |
|---|---|
| `conversations` | Live chat conversations between guests and hotel staff |
| `messages` | Chat messages |
| `translations` | Original and translated message text |
| `notification-templates` | Notification templates |
| `notification-deliveries` | Delivery status, retries and failure alerts |
| `providers` | Provider directory and search (property, city, category, verified status) |
| `provider-verifications` | Provider verification, suspension / rejection |
| `provider-documents` | Provider documents |
| `provider-complaints` | Provider complaint records |

## Tables

- `conversations`
- `messages`
- `message_translations`
- `notification_templates`
- `notification_deliveries`
- `providers`
- `provider_verifications`
- `provider_documents`
- `provider_complaints`

## Integrations

- `integrations/push` (PushAdapter): Push notification adapter
- `integrations/sms` (SmsAdapter): SMS adapter
- `integrations/email` (EmailAdapter): Email adapter
- `integrations/call` (CallAdapter): Call-notification adapter
- `integrations/translation` (TranslationAdapter): Translation provider adapter
