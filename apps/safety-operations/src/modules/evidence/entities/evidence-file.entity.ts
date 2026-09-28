import { Entity } from 'typeorm';
import { BaseEntity } from '@app/common';

@Entity('evidence_files')
export class EvidenceFile extends BaseEntity {}
