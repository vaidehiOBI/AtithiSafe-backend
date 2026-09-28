import { Entity } from 'typeorm';
import { BaseEntity } from '@app/common';

@Entity('memberships')
export class Membership extends BaseEntity {}
