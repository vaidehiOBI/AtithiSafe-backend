import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GraphQLError } from 'graphql';
import { ANONYMOUS_CONTEXT, RequestContext, TokenPayload } from '@app/common';

@Injectable()
export class AuthService {
  constructor(private readonly jwt: JwtService) {}

  /** Verifies a staff or guest token issued by Identity & Property. No token = anonymous. */
  async authenticate(authorization?: string): Promise<RequestContext> {
    if (!authorization) return ANONYMOUS_CONTEXT;
    const [scheme, token] = authorization.split(' ');
    if (scheme?.toLowerCase() !== 'bearer' || !token) throw unauthenticated('Malformed Authorization header');

    let payload: TokenPayload;
    try {
      payload = await this.jwt.verifyAsync<TokenPayload>(token);
    } catch {
      throw unauthenticated('Invalid or expired token');
    }

    if (payload.typ === 'staff') return { kind: 'staff', userId: payload.sub, memberships: payload.memberships ?? [] };
    if (payload.typ === 'guest') {
      return {
        kind: 'guest',
        memberships: [],
        guest: { sessionId: payload.sub, propertyId: payload.propertyId, organizationId: payload.organizationId },
      };
    }
    throw unauthenticated('Unknown token type');
  }
}

const unauthenticated = (message: string) =>
  new GraphQLError(message, { extensions: { code: 'UNAUTHENTICATED', http: { status: 401 } } });
