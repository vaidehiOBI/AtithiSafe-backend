import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver, ResolveReference } from '@nestjs/graphql';
import { AllowGuest, AllowService, CurrentUser, RequestContext } from '@app/common';
import { RecordStatus } from '../../common/enums';
import { OrganizationsService } from '../organizations/organizations.service';
import { Organization } from '../organizations/schemas/organization.schema';
import { PropertySettingsService } from '../property-settings/property-settings.service';
import { PropertySettings } from '../property-settings/schemas/property-setting.schema';
import { PropertiesArgs } from './dto/properties.args';
import { CreatePropertyInput, UpdatePropertyInput } from './dto/property.inputs';
import { PropertiesService } from './properties.service';
import { Property } from './schemas/property.schema';

@Resolver(() => Property)
export class PropertiesResolver {
  constructor(
    private readonly propertiesService: PropertiesService,
    private readonly organizationsService: OrganizationsService,
    private readonly settingsService: PropertySettingsService,
  ) {}

  @AllowGuest()
  @AllowService()
  @Query(() => Property, { description: 'Contract for Safety Operations: getProperty(id)' })
  property(@CurrentUser() ctx: RequestContext, @Args('id', { type: () => ID }) id: string) {
    return this.propertiesService.findOne(ctx, id);
  }

  @Query(() => [Property], { description: 'Properties the caller can see' })
  properties(@CurrentUser() ctx: RequestContext, @Args() args: PropertiesArgs) {
    return this.propertiesService.list(ctx, args);
  }

  @Mutation(() => Property, { description: 'Chain admins of the organisation' })
  createProperty(@CurrentUser() ctx: RequestContext, @Args('input') input: CreatePropertyInput) {
    return this.propertiesService.create(ctx, input);
  }

  @Mutation(() => Property, { description: 'Property admins. Passing departments replaces the list.' })
  updateProperty(
    @CurrentUser() ctx: RequestContext,
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdatePropertyInput,
  ) {
    return this.propertiesService.update(ctx, id, input);
  }

  @Mutation(() => Property, { description: 'Chain admins' })
  setPropertyStatus(
    @CurrentUser() ctx: RequestContext,
    @Args('id', { type: () => ID }) id: string,
    @Args('status', { type: () => RecordStatus }) status: RecordStatus,
  ) {
    return this.propertiesService.setStatus(ctx, id, status);
  }

  @ResolveField(() => Organization)
  organization(@Parent() property: Property) {
    return this.organizationsService.getById(property.organizationId.toString());
  }

  @ResolveField(() => PropertySettings)
  settings(@Parent() property: Property) {
    return this.settingsService.getByPropertyId(property.id);
  }

  @AllowGuest()
  @AllowService()
  @ResolveReference()
  resolveReference(ref: { id: string }) {
    return this.propertiesService.getById(ref.id);
  }
}
