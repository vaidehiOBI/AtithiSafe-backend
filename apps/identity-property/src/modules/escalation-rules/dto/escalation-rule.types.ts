import { ArgsType, Field, ID, InputType, OmitType, PartialType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsEnum, IsMongoId, IsOptional, IsString, Length, ValidateNested } from 'class-validator';
import { IncidentCategory, IncidentSeverity } from '@app/common';
import { EscalationLevel } from '../schemas/escalation-rule.schema';

@InputType()
export class CreateEscalationRuleInput {
  @Field(() => ID, { nullable: true, description: 'Set for a property rule' })
  @IsOptional()
  @IsMongoId()
  propertyId?: string;

  @Field(() => ID, { nullable: true, description: 'Set (without propertyId) for an organisation-wide rule' })
  @IsOptional()
  @IsMongoId()
  organizationId?: string;

  @Field()
  @IsString()
  @Length(2, 120)
  name!: string;

  @Field(() => IncidentCategory, { nullable: true, description: 'Empty = any category' })
  @IsOptional()
  @IsEnum(IncidentCategory)
  incidentCategory?: IncidentCategory;

  @Field(() => IncidentSeverity, { nullable: true, description: 'Empty = any severity' })
  @IsOptional()
  @IsEnum(IncidentSeverity)
  severity?: IncidentSeverity;

  @Field(() => [EscalationLevel])
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => EscalationLevel)
  levels!: EscalationLevel[];
}

@InputType()
export class UpdateEscalationRuleInput extends PartialType(OmitType(CreateEscalationRuleInput, ['propertyId', 'organizationId'] as const)) {
  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

@ArgsType()
export class EscalationRulesArgs {
  @Field(() => ID, { nullable: true, description: 'Rules for a property, including inherited organisation-wide rules' })
  @IsOptional()
  @IsMongoId()
  propertyId?: string;

  @Field(() => ID, { nullable: true, description: 'Organisation-wide rules' })
  @IsOptional()
  @IsMongoId()
  organizationId?: string;
}
