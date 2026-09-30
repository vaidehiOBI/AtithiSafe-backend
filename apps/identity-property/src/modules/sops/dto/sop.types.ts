import { ArgsType, Field, ID, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsEnum, IsMongoId, IsOptional, IsString, Length, ValidateNested } from 'class-validator';
import { IncidentCategory } from '@app/common';
import { SopStatus, SopStep } from '../schemas/sop.schema';

@InputType()
export class CreateSopInput {
  @Field(() => ID, { nullable: true, description: 'Set for a property-specific SOP' })
  @IsOptional()
  @IsMongoId()
  propertyId?: string;

  @Field(() => ID, { nullable: true, description: 'Set (without propertyId) for a corporate SOP. Omit both for an AtithiSafe global default.' })
  @IsOptional()
  @IsMongoId()
  organizationId?: string;

  @Field(() => IncidentCategory)
  @IsEnum(IncidentCategory)
  incidentCategory!: IncidentCategory;

  @Field()
  @IsString()
  @Length(3, 200)
  title!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 2000)
  summary?: string;

  @Field(() => [SopStep])
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => SopStep)
  steps!: SopStep[];
}

@InputType()
export class UpdateSopInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(3, 200)
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 2000)
  summary?: string;

  @Field(() => [SopStep], { nullable: true })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => SopStep)
  steps?: SopStep[];
}

@ArgsType()
export class SopsArgs {
  @Field(() => ID, { nullable: true, description: 'SOP library for a property: its own SOPs plus inherited corporate and global ones' })
  @IsOptional()
  @IsMongoId()
  propertyId?: string;

  @Field(() => ID, { nullable: true, description: 'Corporate SOPs of an organisation' })
  @IsOptional()
  @IsMongoId()
  organizationId?: string;

  @Field(() => IncidentCategory, { nullable: true })
  @IsOptional()
  @IsEnum(IncidentCategory)
  incidentCategory?: IncidentCategory;

  @Field(() => SopStatus, { nullable: true })
  @IsOptional()
  @IsEnum(SopStatus)
  status?: SopStatus;
}
