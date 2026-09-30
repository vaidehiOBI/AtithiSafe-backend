import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver, ResolveReference } from '@nestjs/graphql';
import { AllowGuest, AllowService, CurrentUser, Public, RequestContext } from '@app/common';
import { ConsentsService } from '../consents/consents.service';
import { RecordConsentInput } from '../consents/dto/record-consent.input';
import { Consent } from '../consents/schemas/consent.schema';
import { AddGuestContactInput } from '../guest-contacts/dto/add-guest-contact.input';
import { GuestContactsService } from '../guest-contacts/guest-contacts.service';
import { GuestContact } from '../guest-contacts/schemas/guest-contact.schema';
import { PropertiesService } from '../properties/properties.service';
import { Property } from '../properties/schemas/property.schema';
import { GuestSessionPayload, GuestSessionsArgs, StartGuestSessionInput, UpdateGuestSessionInput } from './dto/guest-session.types';
import { GuestSessionsService } from './guest-sessions.service';
import { effectiveStatus, GuestSession, GuestSessionStatus } from './schemas/guest-session.schema';

/** The guest-facing API: session, language, emergency contacts and consents. */
@Resolver(() => GuestSession)
export class GuestSessionsResolver {
  constructor(
    private readonly guestSessionsService: GuestSessionsService,
    private readonly contactsService: GuestContactsService,
    private readonly consentsService: ConsentsService,
    private readonly propertiesService: PropertiesService,
  ) {}

  // ---- guest ----

  @Public()
  @Mutation(() => GuestSessionPayload, { description: 'Guest app: start a session from a scanned QR code' })
  startGuestSession(@Args('input') input: StartGuestSessionInput) {
    return this.guestSessionsService.start(input);
  }

  @AllowGuest()
  @Query(() => GuestSession, { description: 'The calling guest\'s session' })
  myGuestSession(@CurrentUser() ctx: RequestContext) {
    return this.guestSessionsService.requireActiveForGuest(ctx);
  }

  @AllowGuest()
  @Mutation(() => GuestSession, { description: 'Change language or guest details' })
  updateMyGuestSession(@CurrentUser() ctx: RequestContext, @Args('input') input: UpdateGuestSessionInput) {
    return this.guestSessionsService.updateOwn(ctx, input);
  }

  @AllowGuest()
  @Mutation(() => GuestContact)
  async addMyEmergencyContact(@CurrentUser() ctx: RequestContext, @Args('input') input: AddGuestContactInput) {
    return this.contactsService.add(await this.guestSessionsService.requireActiveForGuest(ctx), input);
  }

  @AllowGuest()
  @Mutation(() => GuestContact)
  async removeMyEmergencyContact(@CurrentUser() ctx: RequestContext, @Args('id', { type: () => ID }) id: string) {
    const session = await this.guestSessionsService.requireActiveForGuest(ctx);
    return this.contactsService.remove(session._id, id);
  }

  @AllowGuest()
  @Mutation(() => Consent, { description: 'Grant or withdraw a consent' })
  async recordMyConsent(@CurrentUser() ctx: RequestContext, @Args('input') input: RecordConsentInput) {
    return this.consentsService.record(await this.guestSessionsService.requireActiveForGuest(ctx), input);
  }

  // ---- staff / services ----

  @AllowGuest()
  @AllowService()
  @Query(() => GuestSession, { description: 'Contract for Safety Operations: getGuestSession(id)' })
  guestSession(@CurrentUser() ctx: RequestContext, @Args('id', { type: () => ID }) id: string) {
    return this.guestSessionsService.findOne(ctx, id);
  }

  @Query(() => [GuestSession])
  guestSessions(@CurrentUser() ctx: RequestContext, @Args() args: GuestSessionsArgs) {
    return this.guestSessionsService.list(ctx, args);
  }

  @AllowGuest()
  @Mutation(() => GuestSession, { description: 'Guest checks out, or staff close the session' })
  endGuestSession(@CurrentUser() ctx: RequestContext, @Args('id', { type: () => ID }) id: string) {
    return this.guestSessionsService.end(ctx, id);
  }

  // ---- fields ----

  @ResolveField(() => GuestSessionStatus)
  status(@Parent() session: GuestSession) {
    return effectiveStatus(session);
  }

  @ResolveField(() => [GuestContact])
  emergencyContacts(@Parent() session: GuestSession) {
    return this.contactsService.listForSession(session.id);
  }

  @ResolveField(() => [Consent], { description: 'Current decision per consent type' })
  consents(@Parent() session: GuestSession) {
    return this.consentsService.currentForSession(session.id);
  }

  @ResolveField(() => [Consent], { description: 'Full consent history, newest first' })
  consentHistory(@Parent() session: GuestSession) {
    return this.consentsService.history(session.id);
  }

  @ResolveField(() => Property)
  property(@Parent() session: GuestSession) {
    return this.propertiesService.getById(session.propertyId.toString());
  }

  @AllowGuest()
  @AllowService()
  @ResolveReference()
  resolveReference(ref: { id: string }) {
    return this.guestSessionsService.getById(ref.id);
  }
}
