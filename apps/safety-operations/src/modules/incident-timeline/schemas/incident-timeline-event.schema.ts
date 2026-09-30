import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BASE_SCHEMA_OPTIONS } from '@app/common';

@Schema({ ...BASE_SCHEMA_OPTIONS, collection: 'incident_timeline_events' })
export class IncidentTimelineEvent {}

export type IncidentTimelineEventDocument = HydratedDocument<IncidentTimelineEvent>;
export const IncidentTimelineEventSchema = SchemaFactory.createForClass(IncidentTimelineEvent);
