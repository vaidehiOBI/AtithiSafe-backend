import { SchemaOptions } from '@nestjs/mongoose';

/** Common options for every collection: createdAt / updatedAt timestamps. */
export const BASE_SCHEMA_OPTIONS: SchemaOptions = {
  timestamps: true,
};
