import { Entity } from 'typeorm';
import { BaseEntity } from '@app/common';

@Entity('roles')
export class Role extends BaseEntity {}
