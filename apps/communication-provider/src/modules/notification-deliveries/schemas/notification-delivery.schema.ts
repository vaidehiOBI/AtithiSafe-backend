import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BASE_SCHEMA_OPTIONS } from '@app/common';

@Schema({ ...BASE_SCHEMA_OPTIONS, collection: 'notification_deliveries' })
export class NotificationDelivery {}

export type NotificationDeliveryDocument = HydratedDocument<NotificationDelivery>;
export const NotificationDeliverySchema = SchemaFactory.createForClass(NotificationDelivery);
