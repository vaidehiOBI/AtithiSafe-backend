import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationShare } from './entities/location-share.entity';
import { LocationSharingResolver } from './location-sharing.resolver';
import { LocationSharingService } from './location-sharing.service';

/** Temporary, consent-based guest location sharing */
@Module({
  imports: [TypeOrmModule.forFeature([LocationShare])],
  providers: [LocationSharingResolver, LocationSharingService],
  exports: [LocationSharingService],
})
export class LocationSharingModule {}
