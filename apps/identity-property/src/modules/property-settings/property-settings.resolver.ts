import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AllowGuest, AllowService, CurrentUser, RequestContext } from '@app/common';
import { UpdatePropertySettingsInput } from './dto/update-property-settings.input';
import { PropertySettingsService } from './property-settings.service';
import { PropertySettings } from './schemas/property-setting.schema';

@Resolver(() => PropertySettings)
export class PropertySettingsResolver {
  constructor(private readonly propertySettingsService: PropertySettingsService) {}

  @AllowGuest()
  @AllowService()
  @Query(() => PropertySettings)
  propertySettings(@CurrentUser() ctx: RequestContext, @Args('propertyId', { type: () => ID }) propertyId: string) {
    return this.propertySettingsService.findForProperty(ctx, propertyId);
  }

  @Mutation(() => PropertySettings, { description: 'Property admins' })
  updatePropertySettings(
    @CurrentUser() ctx: RequestContext,
    @Args('propertyId', { type: () => ID }) propertyId: string,
    @Args('input') input: UpdatePropertySettingsInput,
  ) {
    return this.propertySettingsService.update(ctx, propertyId, input);
  }
}
