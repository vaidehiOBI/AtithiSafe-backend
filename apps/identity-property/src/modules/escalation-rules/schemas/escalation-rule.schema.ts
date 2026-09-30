import { Field, ID, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ArrayMaxSize, IsArray, IsBoolean, IsEnum, IsInt, IsString, Max, Min } from 'class-validator';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { BASE_SCHEMA_OPTIONS, IncidentCategory, IncidentSeverity, StaffRole } from '@app/common';
import { PolicyScope } from '../../../common/policy-scope';

@ObjectType()
@InputType('EscalationLevelInput')
@Schema({ _id: false })
export class EscalationLevel {
  @Field(() => Int, { description: '1 = first escalation' })
  @IsInt()
  @Min(1)
  @Max(10)
  @Prop({ required: true })
  level!: number;

  @Field(() => Int, { description: 'Minutes after the incident is raised without acknowledgement / resolution' })
  @IsInt()
  @Min(0)
  @Max(10080)
  @Prop({ required: true })
  afterMinutes!: number;

  @Field(() => [StaffRole], { defaultValue: [] })
  @IsArray()
  @IsEnum(StaffRole, { each: true })
  @Prop({ type: [String], enum: StaffRole, default: [] })
  notifyRoles!: StaffRole[];

  @Field(() => [String], { defaultValue: [], description: 'Department keys' })
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  @Prop({ type: [String], default: [] })
  notifyDepartments!: string[];

  @Field({ defaultValue: false, description: 'Also alert the property emergency contacts (police, ambulance...)' })
  @IsBoolean()
  @Prop({ default: false })
  notifyEmergencyContacts!: boolean;

  @Field({ defaultValue: false, description: 'Also alert AtithiSafe central operations' })
  @IsBoolean()
  @Prop({ default: false })
  notifyAtithiSafeOperations!: boolean;
}

/**
 * Who to escalate to, and when, if an incident is not handled.
 * Empty incidentCategory / severity means "any". Most specific active rule wins.
 */
@ObjectType()
@Schema({ ...BASE_SCHEMA_OPTIONS, collection: 'escalation_rules' })
export class EscalationRule {
  @Field(() => ID)
  id!: string;

  @Field(() => PolicyScope)
  @Prop({ type: String, enum: [PolicyScope.ORGANIZATION, PolicyScope.PROPERTY], required: true })
  scope!: PolicyScope;

  @Field(() => ID)
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, index: true })
  organizationId!: Types.ObjectId;

  @Field(() => ID, { nullable: true })
  @Prop({ type: MongooseSchema.Types.ObjectId, index: true })
  propertyId?: Types.ObjectId;

  @Field()
  @Prop({ required: true, trim: true })
  name!: string;

  @Field(() => IncidentCategory, { nullable: true })
  @Prop({ type: String, enum: IncidentCategory })
  incidentCategory?: IncidentCategory;

  @Field(() => IncidentSeverity, { nullable: true })
  @Prop({ type: String, enum: IncidentSeverity })
  severity?: IncidentSeverity;

  @Field(() => [EscalationLevel])
  @Prop({ type: [SchemaFactory.createForClass(EscalationLevel)], default: [] })
  levels!: EscalationLevel[];

  @Field()
  @Prop({ default: true })
  isActive!: boolean;

  @Field(() => ID, { nullable: true })
  @Prop({ type: MongooseSchema.Types.ObjectId })
  createdBy?: Types.ObjectId;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

export type EscalationRuleDocument = HydratedDocument<EscalationRule>;
export const EscalationRuleSchema = SchemaFactory.createForClass(EscalationRule);
