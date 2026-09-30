import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BASE_SCHEMA_OPTIONS } from '@app/common';

@Schema({ ...BASE_SCHEMA_OPTIONS, collection: 'evidence_files' })
export class EvidenceFile {}

export type EvidenceFileDocument = HydratedDocument<EvidenceFile>;
export const EvidenceFileSchema = SchemaFactory.createForClass(EvidenceFile);
