import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsEmail, IsEnum, IsOptional, IsString, Length, Matches } from 'class-validator';
import { RecordStatus } from '../../../common/enums';
import { OrganizationType } from '../schemas/organization.schema';

@InputType()
export class CreateOrganizationInput {
  @Field()
  @IsString()
  @Length(2, 120)
  name!: string;

  @Field({ description: 'URL-safe unique identifier, e.g. "taj-hotels"' })
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'slug must be lowercase letters, numbers and hyphens' })
  slug!: string;

  @Field(() => OrganizationType, { defaultValue: OrganizationType.CHAIN })
  @IsEnum(OrganizationType)
  type: OrganizationType = OrganizationType.CHAIN;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  contactPhone?: string;
}

@InputType()
export class UpdateOrganizationInput extends PartialType(CreateOrganizationInput) {
  @Field(() => RecordStatus, { nullable: true, description: 'Operators only' })
  @IsOptional()
  @IsEnum(RecordStatus)
  status?: RecordStatus;
}
