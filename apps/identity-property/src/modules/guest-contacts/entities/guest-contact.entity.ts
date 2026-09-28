import { Entity } from 'typeorm';
import { BaseEntity } from '@app/common';

@Entity('guest_contacts')
export class GuestContact extends BaseEntity {}
