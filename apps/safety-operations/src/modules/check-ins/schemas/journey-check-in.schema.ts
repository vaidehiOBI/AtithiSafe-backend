import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BASE_SCHEMA_OPTIONS } from '@app/common';

@Schema({ ...BASE_SCHEMA_OPTIONS, collection: 'journey_check_ins' })
export class JourneyCheckIn {}

export type JourneyCheckInDocument = HydratedDocument<JourneyCheckIn>;
export const JourneyCheckInSchema = SchemaFactory.createForClass(JourneyCheckIn);
