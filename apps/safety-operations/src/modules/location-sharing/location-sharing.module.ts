import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LocationShare, LocationShareSchema } from './schemas/location-share.schema';
import { LocationSharingResolver } from './location-sharing.resolver';
import { LocationSharingService } from './location-sharing.service';

/** Temporary, consent-based guest location sharing */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LocationShare.name, schema: LocationShareSchema },
    ]),
  ],
  providers: [LocationSharingResolver, LocationSharingService],
  exports: [LocationSharingService],
})
export class LocationSharingModule {}
