import { Entity } from 'typeorm';
import { BaseEntity } from '@app/common';

@Entity('provider_documents')
export class ProviderDocument extends BaseEntity {}
