import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CurrentUser, Public, RequestContext } from '@app/common';
import { CreateQrAccessPointInput, QrValidationResult, UpdateQrAccessPointInput } from './dto/qr-access.types';
import { QrAccessService } from './qr-access.service';
import { QrAccessPoint } from './schemas/qr-access-point.schema';

@Resolver(() => QrAccessPoint)
export class QrAccessResolver {
  constructor(private readonly qrAccessService: QrAccessService) {}

  @Query(() => [QrAccessPoint])
  qrAccessPoints(
    @CurrentUser() ctx: RequestContext,
    @Args('propertyId', { type: () => ID }) propertyId: string,
    @Args('includeInactive', { defaultValue: false }) includeInactive: boolean,
  ) {
    return this.qrAccessService.list(ctx, propertyId, includeInactive);
  }

  @Public()
  @Query(() => QrValidationResult, { description: 'Guest app: validate a scanned QR code before starting a session' })
  validateQrCode(@Args('code') code: string) {
    return this.qrAccessService.validate(code);
  }

  @Mutation(() => QrAccessPoint, { description: 'Property admins' })
  createQrAccessPoint(@CurrentUser() ctx: RequestContext, @Args('input') input: CreateQrAccessPointInput) {
    return this.qrAccessService.create(ctx, input);
  }

  @Mutation(() => QrAccessPoint)
  updateQrAccessPoint(
    @CurrentUser() ctx: RequestContext,
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateQrAccessPointInput,
  ) {
    return this.qrAccessService.update(ctx, id, input);
  }

  @Mutation(() => QrAccessPoint)
  deactivateQrAccessPoint(@CurrentUser() ctx: RequestContext, @Args('id', { type: () => ID }) id: string) {
    return this.qrAccessService.deactivate(ctx, id);
  }

  @ResolveField(() => String, { description: 'URL encoded in the QR code' })
  scanUrl(@Parent() qr: QrAccessPoint) {
    return this.qrAccessService.scanUrl(qr);
  }

  @ResolveField(() => String, { description: 'PNG data URL of the QR code, ready to print' })
  qrImage(@Parent() qr: QrAccessPoint) {
    return this.qrAccessService.qrImage(qr);
  }
}
