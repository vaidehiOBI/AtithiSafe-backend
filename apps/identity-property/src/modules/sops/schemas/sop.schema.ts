import { Directive, Field, ID, InputType, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEnum, IsInt, IsOptional, IsString, Length, Min } from 'class-validator';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { BASE_SCHEMA_OPTIONS, IncidentCategory, StaffRole } from '@app/common';
import { PolicyScope } from '../../../common/policy-scope';

export enum SopStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}
registerEnumType(SopStatus, { name: 'SopStatus' });

@ObjectType()
@InputType('SopStepInput')
@Schema({ _id: false })
export class SopStep {
  @Field(() => Int)
  @IsInt()
  @Min(1)
  @Prop({ required: true })
  order!: number;

  @Field()
  @IsString()
  @Length(1, 1000)
  @Prop({ required: true })
  instruction!: string;

  @Field(() => StaffRole, { nullable: true })
  @IsOptional()
  @IsEnum(StaffRole)
  @Prop({ type: String, enum: StaffRole })
  responsibleRole?: StaffRole;

  @Field({ nullable: true, description: 'Department key, e.g. "security"' })
  @IsOptional()
  @IsString()
  @Prop()
  responsibleDepartment?: string;
}

/**
 * Standard operating procedure for an incident category.
 * GLOBAL = AtithiSafe default, ORGANIZATION = corporate policy, PROPERTY = hotel-specific.
 * Only one PUBLISHED version per scope + category; Safety Operations snapshots it onto incidents.
 */
@ObjectType()
@Directive('@key(fields: "id")')
@Schema({ ...BASE_SCHEMA_OPTIONS, collection: 'sops' })
export class Sop {
  @Field(() => ID)
  id!: string;

  @Field(() => PolicyScope)
  @Prop({ type: String, enum: PolicyScope, required: true })
  scope!: PolicyScope;

  @Field(() => ID, { nullable: true })
  @Prop({ type: MongooseSchema.Types.ObjectId, index: true })
  organizationId?: Types.ObjectId;

  @Field(() => ID, { nullable: true })
  @Prop({ type: MongooseSchema.Types.ObjectId, index: true })
  propertyId?: Types.ObjectId;

  @Field(() => IncidentCategory)
  @Prop({ type: String, enum: IncidentCategory, required: true })
  incidentCategory!: IncidentCategory;

  @Field()
  @Prop({ required: true, trim: true })
  title!: string;

  @Field({ nullable: true })
  @Prop()
  summary?: string;

  @Field(() => [SopStep])
  @Prop({ type: [SchemaFactory.createForClass(SopStep)], default: [] })
  steps!: SopStep[];

  @Field(() => Int)
  @Prop({ required: true })
  version!: number;

  @Field(() => SopStatus)
  @Prop({ type: String, enum: SopStatus, default: SopStatus.DRAFT })
  status!: SopStatus;

  @Field({ nullable: true })
  @Prop()
  publishedAt?: Date;

  @Field(() => ID, { nullable: true })
  @Prop({ type: MongooseSchema.Types.ObjectId })
  createdBy?: Types.ObjectId;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

export type SopDocument = HydratedDocument<Sop>;
export const SopSchema = SchemaFactory.createForClass(Sop);
SopSchema.index({ scope: 1, organizationId: 1, propertyId: 1, incidentCategory: 1, status: 1 });
