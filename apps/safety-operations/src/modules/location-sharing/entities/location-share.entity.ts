import { Entity } from 'typeorm';
import { BaseEntity } from '@app/common';

@Entity('location_shares')
export class LocationShare extends BaseEntity {}
