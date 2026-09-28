import { Resolver } from '@nestjs/graphql';
import { SopSnapshotsService } from './sop-snapshots.service';

@Resolver()
export class SopSnapshotsResolver {
  constructor(private readonly sopSnapshotsService: SopSnapshotsService) {}
}
