import { Directive, Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsOptional, IsString, Length, Matches } from 'class-validator';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { BASE_SCHEMA_OPTIONS } from '@app/common';
import { RecordStatus } from '../../../common/enums';

@ObjectType()
@InputType('AddressInput')
@Schema({ _id: false })
export class Address {
  @Field()
  @IsString()
  @Length(1, 200)
  @Prop({ required: true })
  line1!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Prop()
  line2?: string;

  @Field()
  @IsString()
  @Length(1, 100)
  @Prop({ required: true, index: true })
  city!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Prop()
  state?: string;

  @Field({ description: 'ISO 3166-1 alpha-2, e.g. "IN"' })
  @Matches(/^[A-Z]{2}$/)
  @Prop({ required: true })
  country!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Prop()
  postalCode?: string;
}

@ObjectType()
@InputType('DepartmentInput')
@Schema({ _id: false })
export class Department {
  @Field({ description: 'Stable identifier, e.g. "security", "front-desk"' })
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  @Prop({ required: true })
  key!: string;

  @Field()
  @IsString()
  @Length(1, 80)
  @Prop({ required: true })
  name!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Prop()
  phone?: string;
}

@ObjectType()
@Directive('@key(fields: "id")')
@Schema({ ...BASE_SCHEMA_OPTIONS, collection: 'properties' })
export class Property {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, index: true })
  organizationId!: Types.ObjectId;

  @Field()
  @Prop({ required: true, trim: true })
  name!: string;

  @Field({ description: 'Short code unique within the organisation, e.g. "MUM-01"' })
  @Prop({ required: true, uppercase: true, trim: true })
  code!: string;

  @Field(() => Address)
  @Prop({ type: SchemaFactory.createForClass(Address), required: true })
  address!: Address;

  @Field({ description: 'IANA timezone, e.g. "Asia/Kolkata"' })
  @Prop({ default: 'Asia/Kolkata' })
  timezone!: string;

  @Field(() => [Department])
  @Prop({ type: [SchemaFactory.createForClass(Department)], default: [] })
  departments!: Department[];

  @Field(() => RecordStatus)
  @Prop({ type: String, enum: RecordStatus, default: RecordStatus.ACTIVE })
  status!: RecordStatus;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

export type PropertyDocument = HydratedDocument<Property>;
export const PropertySchema = SchemaFactory.createForClass(Property);
PropertySchema.index({ organizationId: 1, code: 1 }, { unique: true });
