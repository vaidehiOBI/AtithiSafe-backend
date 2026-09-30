import { Field, InputType, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsBoolean, IsEmail, IsInt, IsOptional, IsString, Matches, Max, Min, ValidateNested } from 'class-validator';
import { OperatingHours, PropertyEmergencyContact } from '../schemas/property-setting.schema';

const LANG = /^[a-z]{2,3}(-[A-Z]{2})?$/;

@InputType()
export class UpdatePropertySettingsInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  hotelPhone?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  frontDeskPhone?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field(() => [PropertyEmergencyContact], { nullable: true, description: 'Replaces the full list' })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(30)
  @ValidateNested({ each: true })
  @Type(() => PropertyEmergencyContact)
  emergencyContacts?: PropertyEmergencyContact[];

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  is24x7?: boolean;

  @Field(() => [OperatingHours], { nullable: true, description: 'Replaces the full list' })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(7)
  @ValidateNested({ each: true })
  @Type(() => OperatingHours)
  operatingHours?: OperatingHours[];

  @Field({ nullable: true })
  @IsOptional()
  @Matches(LANG)
  defaultLanguage?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @Matches(LANG, { each: true })
  supportedLanguages?: string[];

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(720)
  guestSessionTtlHours?: number;
}
