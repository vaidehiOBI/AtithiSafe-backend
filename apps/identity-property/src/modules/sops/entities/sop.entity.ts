import { Entity } from 'typeorm';
import { BaseEntity } from '@app/common';

@Entity('sops')
export class Sop extends BaseEntity {}
