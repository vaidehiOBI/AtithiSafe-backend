import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IncidentSopSnapshot, IncidentSopSnapshotSchema } from './schemas/incident-sop-snapshot.schema';
import { SopSnapshotsResolver } from './sop-snapshots.resolver';
import { SopSnapshotsService } from './sop-snapshots.service';

/** Recommended SOP lookup from Identity & Property; snapshot saved on the incident */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: IncidentSopSnapshot.name, schema: IncidentSopSnapshotSchema },
    ]),
  ],
  providers: [SopSnapshotsResolver, SopSnapshotsService],
  exports: [SopSnapshotsService],
})
export class SopSnapshotsModule {}
