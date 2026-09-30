import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { contextFromHeaders } from '@app/common';
import { DatabaseModule } from './database/database.module';
import { HealthResolver } from './health/health.resolver';
import { IntegrationsModule } from './integrations/integrations.module';
import { ConversationsModule } from './modules/conversations/conversations.module';
import { MessagesModule } from './modules/messages/messages.module';
import { TranslationsModule } from './modules/translations/translations.module';
import { NotificationTemplatesModule } from './modules/notification-templates/notification-templates.module';
import { NotificationDeliveriesModule } from './modules/notification-deliveries/notification-deliveries.module';
import { ProvidersModule } from './modules/providers/providers.module';
import { ProviderVerificationsModule } from './modules/provider-verifications/provider-verifications.module';
import { ProviderDocumentsModule } from './modules/provider-documents/provider-documents.module';
import { ProviderComplaintsModule } from './modules/provider-complaints/provider-complaints.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: 'apps/communication-provider/.env' }),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: { federation: 2 },
      context: ({ req }: { req: { headers: Record<string, string> } }) => ({ user: contextFromHeaders(req.headers, process.env.INTERNAL_API_KEY) }),
    }),
    DatabaseModule,
    IntegrationsModule,
    ConversationsModule,
    MessagesModule,
    TranslationsModule,
    NotificationTemplatesModule,
    NotificationDeliveriesModule,
    ProvidersModule,
    ProviderVerificationsModule,
    ProviderDocumentsModule,
    ProviderComplaintsModule,
  ],
  providers: [HealthResolver],
})
export class AppModule {}
