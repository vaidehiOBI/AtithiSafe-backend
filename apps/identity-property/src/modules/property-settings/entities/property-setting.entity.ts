import { Entity } from 'typeorm';
import { BaseEntity } from '@app/common';

@Entity('property_settings')
export class PropertySetting extends BaseEntity {}
