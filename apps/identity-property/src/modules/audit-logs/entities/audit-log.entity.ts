import { Entity } from 'typeorm';
import { BaseEntity } from '@app/common';

@Entity('audit_logs')
export class AuditLog extends BaseEntity {}
