import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BASE_SCHEMA_OPTIONS } from '@app/common';

@Schema({ ...BASE_SCHEMA_OPTIONS, collection: 'provider_complaints' })
export class ProviderComplaint {}

export type ProviderComplaintDocument = HydratedDocument<ProviderComplaint>;
export const ProviderComplaintSchema = SchemaFactory.createForClass(ProviderComplaint);
