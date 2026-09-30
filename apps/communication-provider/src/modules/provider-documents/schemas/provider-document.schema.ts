import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BASE_SCHEMA_OPTIONS } from '@app/common';

@Schema({ ...BASE_SCHEMA_OPTIONS, collection: 'provider_documents' })
export class ProviderDocument {}

export type ProviderDocumentDocument = HydratedDocument<ProviderDocument>;
export const ProviderDocumentSchema = SchemaFactory.createForClass(ProviderDocument);
