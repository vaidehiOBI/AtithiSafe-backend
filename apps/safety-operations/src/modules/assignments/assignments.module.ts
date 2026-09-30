import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IncidentAssignment, IncidentAssignmentSchema } from './schemas/incident-assignment.schema';
import { AssignmentsResolver } from './assignments.resolver';
import { AssignmentsService } from './assignments.service';

/** Incident ownership and staff assignment */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: IncidentAssignment.name, schema: IncidentAssignmentSchema },
    ]),
  ],
  providers: [AssignmentsResolver, AssignmentsService],
  exports: [AssignmentsService],
})
export class AssignmentsModule {}
