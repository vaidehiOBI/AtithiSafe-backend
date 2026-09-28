import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from './entities/property.entity';
import { PropertiesResolver } from './properties.resolver';
import { PropertiesService } from './properties.service';

/** Properties and hotel departments */
@Module({
  imports: [TypeOrmModule.forFeature([Property])],
  providers: [PropertiesResolver, PropertiesService],
  exports: [PropertiesService],
})
export class PropertiesModule {}
