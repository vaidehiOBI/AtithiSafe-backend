import { ArgsType, Field, ID, InputType, OmitType } from '@nestjs/graphql';
import { IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';
import { StaffRole } from '@app/common';

@InputType()
export class AssignMembershipInput {
  @Field(() => ID)
  @IsMongoId()
  userId!: string;

  @Field(() => StaffRole)
  @IsEnum(StaffRole)
  role!: StaffRole;

  @Field(() => ID, { nullable: true, description: 'Required for CHAIN_ADMIN' })
  @IsOptional()
  @IsMongoId()
  organizationId?: string;

  @Field(() => ID, { nullable: true, description: 'Required for PROPERTY_ADMIN and HOTEL_STAFF' })
  @IsOptional()
  @IsMongoId()
  propertyId?: string;

  @Field({ nullable: true, description: 'Department key of the property' })
  @IsOptional()
  @IsString()
  department?: string;
}

/** Membership for a user that is being created in the same request. */
@InputType()
export class NewMembershipInput extends OmitType(AssignMembershipInput, ['userId'] as const) {}

@ArgsType()
export class MembershipsArgs {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsMongoId()
  propertyId?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsMongoId()
  organizationId?: string;

  @Field({ defaultValue: false })
  includeRevoked: boolean = false;
}
