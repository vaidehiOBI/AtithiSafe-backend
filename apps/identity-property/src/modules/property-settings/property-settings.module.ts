import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertySetting } from './entities/property-setting.entity';
import { PropertySettingsResolver } from './property-settings.resolver';
import { PropertySettingsService } from './property-settings.service';

/** Hotel phone, emergency contacts, operating hours */
@Module({
  imports: [TypeOrmModule.forFeature([PropertySetting])],
  providers: [PropertySettingsResolver, PropertySettingsService],
  exports: [PropertySettingsService],
})
export class PropertySettingsModule {}
