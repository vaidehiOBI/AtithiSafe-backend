import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { contextFromHeaders } from '@app/common';
import { DatabaseModule } from './database/database.module';
import { HealthResolver } from './health/health.resolver';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { PropertiesModule } from './modules/properties/properties.module';
import { MembershipsModule } from './modules/memberships/memberships.module';
import { QrAccessModule } from './modules/qr-access/qr-access.module';
import { GuestSessionsModule } from './modules/guest-sessions/guest-sessions.module';
import { GuestContactsModule } from './modules/guest-contacts/guest-contacts.module';
import { ConsentsModule } from './modules/consents/consents.module';
import { PropertySettingsModule } from './modules/property-settings/property-settings.module';
import { SopsModule } from './modules/sops/sops.module';
import { EscalationRulesModule } from './modules/escalation-rules/escalation-rules.module';
import { AuditLogsModule } from './modules/audit-logs/audit-logs.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: 'apps/identity-property/.env' }),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: { federation: 2 },
      context: ({ req }: { req: { headers: Record<string, string> } }) => ({ user: contextFromHeaders(req.headers) }),
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    RolesModule,
    OrganizationsModule,
    PropertiesModule,
    MembershipsModule,
    QrAccessModule,
    GuestSessionsModule,
    GuestContactsModule,
    ConsentsModule,
    PropertySettingsModule,
    SopsModule,
    EscalationRulesModule,
    AuditLogsModule,
  ],
  providers: [HealthResolver],
})
export class AppModule {}
