import { Entity } from 'typeorm';
import { BaseEntity } from '@app/common';

@Entity('consents')
export class Consent extends BaseEntity {}
