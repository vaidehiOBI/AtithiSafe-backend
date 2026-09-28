import { Resolver } from '@nestjs/graphql';
import { GuestSessionsService } from './guest-sessions.service';

@Resolver()
export class GuestSessionsResolver {
  constructor(private readonly guestSessionsService: GuestSessionsService) {}
}
