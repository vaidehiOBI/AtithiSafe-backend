import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BASE_SCHEMA_OPTIONS } from '@app/common';

@Schema({ ...BASE_SCHEMA_OPTIONS, collection: 'incident_assignments' })
export class IncidentAssignment {}

export type IncidentAssignmentDocument = HydratedDocument<IncidentAssignment>;
export const IncidentAssignmentSchema = SchemaFactory.createForClass(IncidentAssignment);
