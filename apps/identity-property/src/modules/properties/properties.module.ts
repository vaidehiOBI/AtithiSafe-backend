import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrganizationsModule } from '../organizations/organizations.module';
import { PropertySettingsModule } from '../property-settings/property-settings.module';
import { PropertiesResolver } from './properties.resolver';
import { PropertiesService } from './properties.service';
import { Property, PropertySchema } from './schemas/property.schema';

/** Properties and hotel departments */
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Property.name, schema: PropertySchema }]),
    OrganizationsModule,
    PropertySettingsModule,
  ],
  providers: [PropertiesResolver, PropertiesService],
  exports: [PropertiesService],
})
export class PropertiesModule {}
