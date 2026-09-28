import { Entity } from 'typeorm';
import { BaseEntity } from '@app/common';

@Entity('users')
export class User extends BaseEntity {}
