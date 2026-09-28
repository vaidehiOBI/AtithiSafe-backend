import { Entity } from 'typeorm';
import { BaseEntity } from '@app/common';

@Entity('organizations')
export class Organization extends BaseEntity {}
