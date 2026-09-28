import { Entity } from 'typeorm';
import { BaseEntity } from '@app/common';

@Entity('provider_complaints')
export class ProviderComplaint extends BaseEntity {}
