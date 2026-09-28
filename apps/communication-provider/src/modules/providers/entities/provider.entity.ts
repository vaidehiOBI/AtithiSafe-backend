import { Entity } from 'typeorm';
import { BaseEntity } from '@app/common';

@Entity('providers')
export class Provider extends BaseEntity {}
