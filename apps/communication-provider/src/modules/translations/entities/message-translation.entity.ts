import { Entity } from 'typeorm';
import { BaseEntity } from '@app/common';

@Entity('message_translations')
export class MessageTranslation extends BaseEntity {}
