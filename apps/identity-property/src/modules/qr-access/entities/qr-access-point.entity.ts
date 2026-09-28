import { Entity } from 'typeorm';
import { BaseEntity } from '@app/common';

@Entity('qr_access_points')
export class QrAccessPoint extends BaseEntity {}
