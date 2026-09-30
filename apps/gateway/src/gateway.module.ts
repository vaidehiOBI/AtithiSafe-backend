import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ANONYMOUS_CONTEXT, CONTEXT_HEADERS, encodeContext, RequestContext } from '@app/common';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { subgraphs } from './config/subgraphs.config';

/**
 * Forwards the authenticated identity to each subgraph. Client headers are not passed through,
 * so a client cannot set x-auth-context itself.
 */
class AuthenticatedDataSource extends RemoteGraphQLDataSource<{ user?: RequestContext }> {
  constructor(url: string, private readonly internalApiKey: string) {
    super({ url });
  }

  willSendRequest({ request, context }: any) {
    request.http.headers.set(CONTEXT_HEADERS.internalApiKey, this.internalApiKey);
    request.http.headers.set(CONTEXT_HEADERS.authContext, encodeContext(context.user ?? ANONYMOUS_CONTEXT));
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: 'apps/gateway/.env' }),
    GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      imports: [AuthModule],
      inject: [AuthService, ConfigService],
      useFactory: (auth: AuthService, config: ConfigService) => {
        const internalApiKey = config.getOrThrow<string>('INTERNAL_API_KEY');
        return {
          server: {
            context: async ({ req }: { req: { headers: Record<string, string> } }) => ({
              user: await auth.authenticate(req.headers.authorization),
            }),
          },
          gateway: {
            // Dev: introspect subgraphs. Prod: use a composed supergraph schema (rover supergraph compose).
            supergraphSdl: new IntrospectAndCompose({ subgraphs: subgraphs() }),
            buildService: ({ url }) => new AuthenticatedDataSource(url!, internalApiKey),
          },
        };
      },
    }),
  ],
})
export class GatewayModule {}
