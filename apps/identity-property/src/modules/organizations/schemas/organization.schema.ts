import { Directive, Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BASE_SCHEMA_OPTIONS } from '@app/common';
import { RecordStatus } from '../../../common/enums';

export enum OrganizationType {
  CHAIN = 'CHAIN',
  INDEPENDENT = 'INDEPENDENT',
}
registerEnumType(OrganizationType, { name: 'OrganizationType' });

@ObjectType()
@Directive('@key(fields: "id")')
@Schema({ ...BASE_SCHEMA_OPTIONS, collection: 'organizations' })
export class Organization {
  @Field(() => ID)
  id!: string;

  @Field()
  @Prop({ required: true, trim: true })
  name!: string;

  @Field()
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  slug!: string;

  @Field(() => OrganizationType)
  @Prop({ type: String, enum: OrganizationType, default: OrganizationType.CHAIN })
  type!: OrganizationType;

  @Field({ nullable: true })
  @Prop({ trim: true, lowercase: true })
  contactEmail?: string;

  @Field({ nullable: true })
  @Prop({ trim: true })
  contactPhone?: string;

  @Field(() => RecordStatus)
  @Prop({ type: String, enum: RecordStatus, default: RecordStatus.ACTIVE })
  status!: RecordStatus;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

export type OrganizationDocument = HydratedDocument<Organization>;
export const OrganizationSchema = SchemaFactory.createForClass(Organization);
