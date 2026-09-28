import { Resolver } from '@nestjs/graphql';
import { GuestContactsService } from './guest-contacts.service';

@Resolver()
export class GuestContactsResolver {
  constructor(private readonly guestContactsService: GuestContactsService) {}
}
