import { Entity } from 'typeorm';
import { BaseEntity } from '@app/common';

@Entity('properties')
export class Property extends BaseEntity {}
