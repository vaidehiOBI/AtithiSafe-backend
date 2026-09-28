import { Injectable } from '@nestjs/common';
import { RequestContext } from '@app/common';

@Injectable()
export class AuthService {
  /** Verifies the staff JWT / guest session token and resolves roles + property scope. */
  async authenticate(_authorization?: string): Promise<RequestContext> {
    // TODO: verify token with JWT_SECRET
    return { roles: [], propertyIds: [] };
  }
}
