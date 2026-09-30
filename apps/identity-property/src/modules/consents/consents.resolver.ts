import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { AllowGuest, AllowService, CurrentUser, RequestContext } from '@app/common';
import { ConsentsService } from './consents.service';
import { Consent, ConsentType } from './schemas/consent.schema';

@Resolver(() => Consent)
export class ConsentsResolver {
  constructor(private readonly consentsService: ConsentsService) {}

  @AllowGuest()
  @AllowService()
  @Query(() => Boolean, { description: 'Contract for Safety Operations: has the guest currently granted this consent?' })
  hasActiveConsent(
    @CurrentUser() ctx: RequestContext,
    @Args('guestSessionId', { type: () => ID }) guestSessionId: string,
    @Args('type', { type: () => ConsentType }) type: ConsentType,
  ) {
    return this.consentsService.hasActiveConsent(ctx, guestSessionId, type);
  }
}
