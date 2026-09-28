import { Entity } from 'typeorm';
import { BaseEntity } from '@app/common';

@Entity('journey_check_ins')
export class JourneyCheckIn extends BaseEntity {}
