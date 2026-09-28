import { Entity } from 'typeorm';
import { BaseEntity } from '@app/common';

@Entity('vehicles')
export class Vehicle extends BaseEntity {}
