import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PropertySettingsResolver } from './property-settings.resolver';
import { PropertySettingsService } from './property-settings.service';
import { PropertySettings, PropertySettingsSchema } from './schemas/property-setting.schema';

/** Hotel phone, emergency contacts, operating hours, languages, guest session length */
@Module({
  imports: [MongooseModule.forFeature([{ name: PropertySettings.name, schema: PropertySettingsSchema }])],
  providers: [PropertySettingsResolver, PropertySettingsService],
  exports: [PropertySettingsService],
})
export class PropertySettingsModule {}
