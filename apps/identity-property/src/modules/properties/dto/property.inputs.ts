import { Field, ID, InputType, OmitType, PartialType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsMongoId, IsOptional, IsString, Length, Matches, ValidateNested } from 'class-validator';
import { Address, Department } from '../schemas/property.schema';

@InputType()
export class CreatePropertyInput {
  @Field(() => ID)
  @IsMongoId()
  organizationId!: string;

  @Field()
  @IsString()
  @Length(2, 120)
  name!: string;

  @Field()
  @Matches(/^[A-Za-z0-9-]{2,20}$/)
  code!: string;

  @Field(() => Address)
  @ValidateNested()
  @Type(() => Address)
  address!: Address;

  @Field({ defaultValue: 'Asia/Kolkata' })
  @IsString()
  timezone: string = 'Asia/Kolkata';

  @Field(() => [Department], { nullable: true })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => Department)
  departments?: Department[];
}

@InputType()
export class UpdatePropertyInput extends PartialType(OmitType(CreatePropertyInput, ['organizationId'] as const)) {}
