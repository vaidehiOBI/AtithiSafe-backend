import { Entity } from 'typeorm';
import { BaseEntity } from '@app/common';

@Entity('escalation_rules')
export class EscalationRule extends BaseEntity {}
