import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { CONTEXT_HEADERS, RequestContext } from '@app/common';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { subgraphs } from './config/subgraphs.config';

/** Forwards the authenticated identity to each subgraph as headers. */
class AuthenticatedDataSource extends RemoteGraphQLDataSource<{ user?: RequestContext }> {
  willSendRequest({ request, context }: any) {
    const user: RequestContext | undefined = context.user;
    if (!user) return;
    if (user.userId) request.http.headers.set(CONTEXT_HEADERS.userId, user.userId);
    if (user.guestSessionId) request.http.headers.set(CONTEXT_HEADERS.guestSessionId, user.guestSessionId);
    request.http.headers.set(CONTEXT_HEADERS.roles, user.roles.join(','));
    request.http.headers.set(CONTEXT_HEADERS.propertyIds, user.propertyIds.join(','));
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: 'apps/gateway/.env' }),
    GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      imports: [AuthModule],
      inject: [AuthService],
      useFactory: (auth: AuthService) => ({
        server: {
          context: async ({ req }: { req: { headers: Record<string, string> } }) => ({
            user: await auth.authenticate(req.headers.authorization),
          }),
        },
        gateway: {
          // Dev: introspect subgraphs. Prod: use a composed supergraph schema (rover supergraph compose).
          supergraphSdl: new IntrospectAndCompose({ subgraphs: subgraphs() }),
          buildService: ({ url }) => new AuthenticatedDataSource({ url }),
        },
      }),
    }),
  ],
})
export class GatewayModule {}
