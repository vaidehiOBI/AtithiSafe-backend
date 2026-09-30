import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BASE_SCHEMA_OPTIONS } from '@app/common';

@Schema({ ...BASE_SCHEMA_OPTIONS, collection: 'provider_verifications' })
export class ProviderVerification {}

export type ProviderVerificationDocument = HydratedDocument<ProviderVerification>;
export const ProviderVerificationSchema = SchemaFactory.createForClass(ProviderVerification);
