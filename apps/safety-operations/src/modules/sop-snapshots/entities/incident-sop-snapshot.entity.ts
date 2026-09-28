import { Entity } from 'typeorm';
import { BaseEntity } from '@app/common';

@Entity('incident_sop_snapshots')
export class IncidentSopSnapshot extends BaseEntity {}
