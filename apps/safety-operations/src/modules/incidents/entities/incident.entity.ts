import { Entity } from 'typeorm';
import { BaseEntity } from '@app/common';

@Entity('incidents')
export class Incident extends BaseEntity {}
