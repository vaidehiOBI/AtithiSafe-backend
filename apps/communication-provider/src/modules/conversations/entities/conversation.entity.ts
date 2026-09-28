import { Entity } from 'typeorm';
import { BaseEntity } from '@app/common';

@Entity('conversations')
export class Conversation extends BaseEntity {}
