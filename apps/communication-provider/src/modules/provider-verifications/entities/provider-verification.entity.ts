import { Entity } from 'typeorm';
import { BaseEntity } from '@app/common';

@Entity('provider_verifications')
export class ProviderVerification extends BaseEntity {}
