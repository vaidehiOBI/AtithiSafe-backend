import { Entity } from 'typeorm';
import { BaseEntity } from '@app/common';

@Entity('incident_assignments')
export class IncidentAssignment extends BaseEntity {}
