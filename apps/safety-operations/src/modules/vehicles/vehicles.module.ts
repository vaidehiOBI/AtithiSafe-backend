import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { VehiclesResolver } from './vehicles.resolver';
import { VehiclesService } from './vehicles.service';

/** Driver / vehicle records */
@Module({
  imports: [TypeOrmModule.forFeature([Vehicle])],
  providers: [VehiclesResolver, VehiclesService],
  exports: [VehiclesService],
})
export class VehiclesModule {}
