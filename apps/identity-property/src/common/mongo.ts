import { NotFoundException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

/** Throws 404 for ids that are missing or not valid ObjectIds (avoids CastErrors surfacing as 500s). */
export function assertFound<T>(doc: T, entity: string): NonNullable<T> {
  if (!doc) throw new NotFoundException(`${entity} not found`);
  return doc;
}

export const validId = (id: unknown): id is string => typeof id === 'string' && isValidObjectId(id);
