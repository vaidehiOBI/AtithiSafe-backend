import { ArgsType, Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { IsEnum, IsMongoId, IsOptional, IsString, Length, Matches } from 'class-validator';
import { PageArgs } from '../../../common/page.args';
import { GuestSession, GuestSessionStatus } from '../schemas/guest-session.schema';

const LANG = /^[a-z]{2,3}(-[A-Z]{2})?$/;

@InputType()
export class StartGuestSessionInput {
  @Field({ description: 'Code from the scanned QR' })
  @IsString()
  @Length(10, 64)
  qrCode!: string;

  @Field()
  @Matches(LANG)
  language!: string;

  @Field({ description: 'Version of the privacy notice the guest accepted (records DATA_PROCESSING consent)' })
  @IsString()
  @Length(1, 20)
  acceptedPolicyVersion!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 120)
  guestName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  roomNumber?: string;

  @Field({ nullable: true })
  @IsOptional()
  @Matches(/^\+?[0-9 ()-]{6,20}$/)
  phone?: string;
}

@InputType()
export class UpdateGuestSessionInput {
  @Field({ nullable: true })
  @IsOptional()
  @Matches(LANG)
  language?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 120)
  guestName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  roomNumber?: string;

  @Field({ nullable: true })
  @IsOptional()
  @Matches(/^\+?[0-9 ()-]{6,20}$/)
  phone?: string;
}

@ObjectType()
export class GuestSessionPayload {
  @Field({ description: 'Send as "Authorization: Bearer <token>"; valid until the session expires' })
  guestToken!: string;

  @Field(() => GuestSession)
  session!: GuestSession;
}

@ArgsType()
export class GuestSessionsArgs extends PageArgs {
  @Field(() => ID)
  @IsMongoId()
  propertyId!: string;

  @Field(() => GuestSessionStatus, { nullable: true })
  @IsOptional()
  @IsEnum(GuestSessionStatus)
  status?: GuestSessionStatus;
}
