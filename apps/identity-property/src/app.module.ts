import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard, contextFromHeaders } from '@app/common';
import { withHttpErrorCode } from './common/format-error';
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
    GraphQLModule.forRootAsync<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const internalApiKey = config.getOrThrow<string>('INTERNAL_API_KEY');
        return {
          autoSchemaFile: { federation: 2 },
          sortSchema: true,
          formatError: withHttpErrorCode,
          context: ({ req }: { req: { headers: Record<string, string> } }) => ({ user: contextFromHeaders(req.headers, internalApiKey) }),
        };
      },
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get('JWT_EXPIRES_IN', '12h') },
      }),
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
  providers: [HealthResolver, { provide: APP_GUARD, useClass: AuthGuard }],
})
export class AppModule {}
