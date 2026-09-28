import { Entity } from 'typeorm';
import { BaseEntity } from '@app/common';

@Entity('incident_escalations')
export class IncidentEscalation extends BaseEntity {}
