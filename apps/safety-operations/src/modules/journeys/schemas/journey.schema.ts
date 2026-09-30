import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BASE_SCHEMA_OPTIONS } from '@app/common';

@Schema({ ...BASE_SCHEMA_OPTIONS, collection: 'journeys' })
export class Journey {}

export type JourneyDocument = HydratedDocument<Journey>;
export const JourneySchema = SchemaFactory.createForClass(Journey);
