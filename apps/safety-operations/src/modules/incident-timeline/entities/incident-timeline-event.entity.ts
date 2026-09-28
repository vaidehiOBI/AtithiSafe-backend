import { Entity } from 'typeorm';
import { BaseEntity } from '@app/common';

@Entity('incident_timeline_events')
export class IncidentTimelineEvent extends BaseEntity {}
