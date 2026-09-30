import { Args, ID, Mutation, Query, Resolver, ResolveReference } from '@nestjs/graphql';
import { AllowGuest, AllowService, CurrentUser, RequestContext } from '@app/common';
import { CreateOrganizationInput, UpdateOrganizationInput } from './dto/organization.inputs';
import { OrganizationsService } from './organizations.service';
import { Organization } from './schemas/organization.schema';

@Resolver(() => Organization)
export class OrganizationsResolver {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @AllowService()
  @Query(() => Organization)
  organization(@CurrentUser() ctx: RequestContext, @Args('id', { type: () => ID }) id: string) {
    return this.organizationsService.findOne(ctx, id);
  }

  @Query(() => [Organization], { description: 'Organisations the caller belongs to (all for operators)' })
  organizations(@CurrentUser() ctx: RequestContext) {
    return this.organizationsService.list(ctx);
  }

  @Mutation(() => Organization, { description: 'Operators only' })
  createOrganization(@CurrentUser() ctx: RequestContext, @Args('input') input: CreateOrganizationInput) {
    return this.organizationsService.create(ctx, input);
  }

  @Mutation(() => Organization)
  updateOrganization(
    @CurrentUser() ctx: RequestContext,
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateOrganizationInput,
  ) {
    return this.organizationsService.update(ctx, id, input);
  }

  @AllowGuest()
  @AllowService()
  @ResolveReference()
  resolveReference(ref: { id: string }) {
    return this.organizationsService.getById(ref.id);
  }
}
