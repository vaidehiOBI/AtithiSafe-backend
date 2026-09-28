import { Entity } from 'typeorm';
import { BaseEntity } from '@app/common';

@Entity('notification_deliveries')
export class NotificationDelivery extends BaseEntity {}
