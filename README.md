# AtithiSafe Backend

NestJS microservices exposed through a single GraphQL API (Apollo Federation 2).

```
Clients (web / guest app)
        │  GraphQL
        ▼
  apps/gateway  :4000   ── Apollo Federation gateway, authentication
        │
        ├── apps/identity-property       :4001  ── DB: identity_property
        ├── apps/safety-operations       :4002  ── DB: safety_operations
        └── apps/communication-provider  :4003  ── DB: communication_provider
```

## Services

| Service | Owns |
|---|---|
| [Identity & Property Management](apps/identity-property/README.md) | Owns who can access the system and how each hotel operates. |
| [Safety Operations](apps/safety-operations/README.md) | Core service. Owns every safety case from creation to resolution. |
| [Communication & Provider](apps/communication-provider/README.md) | Handles communication with the guest and manages trusted local providers. |

## Rules

- Each service owns its database. No service reads another service's tables.
- Clients only talk to the gateway. The gateway authenticates and forwards identity to services as `x-user-*` headers.
- Services talk to each other through GraphQL (e.g. Safety Operations → Identity & Property for SOPs) or domain events (`libs/common/src/events`).
- Code shared across services lives in `libs/common` (`@app/common`).

## Folder structure

```
apps/
  gateway/src/
    auth/                 token verification
    config/               subgraph URLs
  <service>/src/
    modules/<module>/
      entities/           TypeORM entities (one per table)
      dto/                GraphQL inputs / object types
      <module>.module.ts
      <module>.resolver.ts
      <module>.service.ts
    database/             TypeORM connection + migrations
    integrations/         external clients / adapters
    events/               domain event publishers / handlers
    health/
libs/common/src/          auth, base entity, domain events
```

## Run locally

```bash
npm install
cp .env.example .env    # plus apps/*/.env.example -> apps/*/.env
docker compose up -d identity-property-db safety-operations-db communication-provider-db

npm run start:identity
npm run start:safety
npm run start:comms
npm run start:gateway   # start last: it introspects the services
```

Or run everything with `docker compose up --build`.
