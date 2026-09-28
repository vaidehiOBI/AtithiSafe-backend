import { Entity } from 'typeorm';
import { BaseEntity } from '@app/common';

@Entity('notification_templates')
export class NotificationTemplate extends BaseEntity {}
