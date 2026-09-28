import { Resolver } from '@nestjs/graphql';
import { VehiclesService } from './vehicles.service';

@Resolver()
export class VehiclesResolver {
  constructor(private readonly vehiclesService: VehiclesService) {}
}
