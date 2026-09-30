import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PropertiesModule } from '../properties/properties.module';
import { PropertySettingsModule } from '../property-settings/property-settings.module';
import { QrAccessResolver } from './qr-access.resolver';
import { QrAccessService } from './qr-access.service';
import { QrAccessPoint, QrAccessPointSchema } from './schemas/qr-access-point.schema';

/** Guest QR creation, expiry and scan validation */
@Module({
  imports: [MongooseModule.forFeature([{ name: QrAccessPoint.name, schema: QrAccessPointSchema }]), PropertiesModule, PropertySettingsModule],
  providers: [QrAccessResolver, QrAccessService],
  exports: [QrAccessService],
})
export class QrAccessModule {}
