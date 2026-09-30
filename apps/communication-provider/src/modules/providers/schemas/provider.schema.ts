import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BASE_SCHEMA_OPTIONS } from '@app/common';

@Schema({ ...BASE_SCHEMA_OPTIONS, collection: 'providers' })
export class Provider {}

export type ProviderDocument = HydratedDocument<Provider>;
export const ProviderSchema = SchemaFactory.createForClass(Provider);
