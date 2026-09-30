import { ArgsType, Field, ID, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsEmail, IsMongoId, IsOptional, IsString, Length, ValidateNested } from 'class-validator';
import { NewMembershipInput } from '../../memberships/dto/membership.inputs';

export const PASSWORD_RULES = { min: 10, max: 128 };

@InputType()
export class CreateStaffUserInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @IsString()
  @Length(2, 120)
  fullName!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  phone?: string;

  @Field({ description: 'Initial password (10-128 characters)' })
  @IsString()
  @Length(PASSWORD_RULES.min, PASSWORD_RULES.max)
  password!: string;

  @Field(() => NewMembershipInput, { description: 'Every staff user is created with a role in some scope' })
  @ValidateNested()
  @Type(() => NewMembershipInput)
  membership!: NewMembershipInput;
}

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(2, 120)
  fullName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  phone?: string;
}

@ArgsType()
export class UsersArgs {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsMongoId()
  propertyId?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsMongoId()
  organizationId?: string;
}
