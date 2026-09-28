import { Entity } from 'typeorm';
import { BaseEntity } from '@app/common';

@Entity('guest_sessions')
export class GuestSession extends BaseEntity {}
