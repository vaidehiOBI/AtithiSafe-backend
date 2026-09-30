import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BASE_SCHEMA_OPTIONS } from '@app/common';

@Schema({ ...BASE_SCHEMA_OPTIONS, collection: 'notification_templates' })
export class NotificationTemplate {}

export type NotificationTemplateDocument = HydratedDocument<NotificationTemplate>;
export const NotificationTemplateSchema = SchemaFactory.createForClass(NotificationTemplate);
