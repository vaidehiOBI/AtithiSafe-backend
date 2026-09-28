import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncidentAssignment } from './entities/incident-assignment.entity';
import { AssignmentsResolver } from './assignments.resolver';
import { AssignmentsService } from './assignments.service';

/** Incident ownership and staff assignment */
@Module({
  imports: [TypeOrmModule.forFeature([IncidentAssignment])],
  providers: [AssignmentsResolver, AssignmentsService],
  exports: [AssignmentsService],
})
export class AssignmentsModule {}
