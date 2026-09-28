import { Entity } from 'typeorm';
import { BaseEntity } from '@app/common';

@Entity('journeys')
export class Journey extends BaseEntity {}
