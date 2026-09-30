import { Args, ID, Mutation, Query, Resolver, ResolveReference } from '@nestjs/graphql';
import { AllowGuest, AllowService, CurrentUser, IncidentCategory, RequestContext } from '@app/common';
import { CreateSopInput, SopsArgs, UpdateSopInput } from './dto/sop.types';
import { Sop } from './schemas/sop.schema';
import { SopsService } from './sops.service';

@Resolver(() => Sop)
export class SopsResolver {
  constructor(private readonly sopsService: SopsService) {}

  @AllowService()
  @Query(() => Sop)
  sop(@CurrentUser() ctx: RequestContext, @Args('id', { type: () => ID }) id: string) {
    return this.sopsService.findOne(ctx, id);
  }

  @Query(() => [Sop], { description: 'SOP library' })
  sops(@CurrentUser() ctx: RequestContext, @Args() args: SopsArgs) {
    return this.sopsService.list(ctx, args);
  }

  @AllowService()
  @Query(() => Sop, { nullable: true, description: 'Contract for Safety Operations: most specific published SOP for a property + incident category' })
  applicableSop(
    @CurrentUser() ctx: RequestContext,
    @Args('propertyId', { type: () => ID }) propertyId: string,
    @Args('incidentCategory', { type: () => IncidentCategory }) incidentCategory: IncidentCategory,
  ) {
    return this.sopsService.findApplicable(ctx, propertyId, incidentCategory);
  }

  @Mutation(() => Sop, { description: 'Creates a new DRAFT version' })
  createSop(@CurrentUser() ctx: RequestContext, @Args('input') input: CreateSopInput) {
    return this.sopsService.create(ctx, input);
  }

  @Mutation(() => Sop)
  updateSop(@CurrentUser() ctx: RequestContext, @Args('id', { type: () => ID }) id: string, @Args('input') input: UpdateSopInput) {
    return this.sopsService.update(ctx, id, input);
  }

  @Mutation(() => Sop)
  publishSop(@CurrentUser() ctx: RequestContext, @Args('id', { type: () => ID }) id: string) {
    return this.sopsService.publish(ctx, id);
  }

  @Mutation(() => Sop)
  archiveSop(@CurrentUser() ctx: RequestContext, @Args('id', { type: () => ID }) id: string) {
    return this.sopsService.archive(ctx, id);
  }

  @AllowGuest()
  @AllowService()
  @ResolveReference()
  resolveReference(ref: { id: string }) {
    return this.sopsService.getById(ref.id);
  }
}
