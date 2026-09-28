import { Entity } from 'typeorm';
import { BaseEntity } from '@app/common';

@Entity('messages')
export class Message extends BaseEntity {}
