import { registerEnumType } from '@nestjs/graphql';

export enum RecordStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

registerEnumType(RecordStatus, { name: 'RecordStatus' });
