import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncidentSopSnapshot } from './entities/incident-sop-snapshot.entity';
import { SopSnapshotsResolver } from './sop-snapshots.resolver';
import { SopSnapshotsService } from './sop-snapshots.service';

/** Recommended SOP lookup from Identity & Property; snapshot saved on the incident */
@Module({
  imports: [TypeOrmModule.forFeature([IncidentSopSnapshot])],
  providers: [SopSnapshotsResolver, SopSnapshotsService],
  exports: [SopSnapshotsService],
})
export class SopSnapshotsModule {}
