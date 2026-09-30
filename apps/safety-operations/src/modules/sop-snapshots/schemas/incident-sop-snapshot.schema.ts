import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BASE_SCHEMA_OPTIONS } from '@app/common';

@Schema({ ...BASE_SCHEMA_OPTIONS, collection: 'incident_sop_snapshots' })
export class IncidentSopSnapshot {}

export type IncidentSopSnapshotDocument = HydratedDocument<IncidentSopSnapshot>;
export const IncidentSopSnapshotSchema = SchemaFactory.createForClass(IncidentSopSnapshot);
