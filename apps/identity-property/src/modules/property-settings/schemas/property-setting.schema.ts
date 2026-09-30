import { Field, ID, InputType, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Length, Matches, Max, Min } from 'class-validator';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { BASE_SCHEMA_OPTIONS } from '@app/common';

export enum EmergencyContactType {
  POLICE = 'POLICE',
  AMBULANCE = 'AMBULANCE',
  FIRE = 'FIRE',
  HOTEL_SECURITY = 'HOTEL_SECURITY',
  DUTY_MANAGER = 'DUTY_MANAGER',
  HOSPITAL = 'HOSPITAL',
  EMBASSY = 'EMBASSY',
  OTHER = 'OTHER',
}
registerEnumType(EmergencyContactType, { name: 'EmergencyContactType' });

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

@ObjectType()
@InputType('PropertyEmergencyContactInput')
@Schema({ _id: false })
export class PropertyEmergencyContact {
  @Field(() => EmergencyContactType)
  @IsEnum(EmergencyContactType)
  @Prop({ type: String, enum: EmergencyContactType, required: true })
  type!: EmergencyContactType;

  @Field()
  @IsString()
  @Length(1, 120)
  @Prop({ required: true })
  name!: string;

  @Field()
  @IsString()
  @Length(3, 30)
  @Prop({ required: true })
  phone!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Prop()
  notes?: string;
}

@ObjectType()
@InputType('OperatingHoursInput')
@Schema({ _id: false })
export class OperatingHours {
  @Field(() => Int, { description: '0 = Sunday … 6 = Saturday' })
  @IsInt()
  @Min(0)
  @Max(6)
  @Prop({ required: true, min: 0, max: 6 })
  dayOfWeek!: number;

  @Field({ nullable: true, description: 'HH:mm, property local time' })
  @IsOptional()
  @Matches(TIME)
  @Prop()
  opensAt?: string;

  @Field({ nullable: true, description: 'HH:mm, property local time' })
  @IsOptional()
  @Matches(TIME)
  @Prop()
  closesAt?: string;

  @Field({ defaultValue: false })
  @IsBoolean()
  @Prop({ default: false })
  closed!: boolean;
}

@ObjectType()
@Schema({ ...BASE_SCHEMA_OPTIONS, collection: 'property_settings' })
export class PropertySettings {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, unique: true })
  propertyId!: Types.ObjectId;

  @Field(() => ID)
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, index: true })
  organizationId!: Types.ObjectId;

  @Field({ nullable: true })
  @Prop()
  hotelPhone?: string;

  @Field({ nullable: true })
  @Prop()
  frontDeskPhone?: string;

  @Field({ nullable: true })
  @Prop()
  email?: string;

  @Field(() => [PropertyEmergencyContact])
  @Prop({ type: [SchemaFactory.createForClass(PropertyEmergencyContact)], default: [] })
  emergencyContacts!: PropertyEmergencyContact[];

  @Field({ description: 'Front desk / safety desk staffed around the clock' })
  @Prop({ default: true })
  is24x7!: boolean;

  @Field(() => [OperatingHours], { description: 'Used when is24x7 is false' })
  @Prop({ type: [SchemaFactory.createForClass(OperatingHours)], default: [] })
  operatingHours!: OperatingHours[];

  @Field()
  @Prop({ default: 'en' })
  defaultLanguage!: string;

  @Field(() => [String])
  @Prop({ type: [String], default: ['en'] })
  supportedLanguages!: string[];

  @Field(() => Int, { description: 'How long a guest session lasts after a QR scan' })
  @Prop({ default: 24, min: 1, max: 720 })
  guestSessionTtlHours!: number;

  @Field()
  updatedAt!: Date;
}

export type PropertySettingsDocument = HydratedDocument<PropertySettings>;
export const PropertySettingsSchema = SchemaFactory.createForClass(PropertySettings);
