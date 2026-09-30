import { Field, ID, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsDate, IsMongoId, IsOptional, IsString, Length } from 'class-validator';

@InputType()
export class CreateQrAccessPointInput {
  @Field(() => ID)
  @IsMongoId()
  propertyId!: string;

  @Field()
  @IsString()
  @Length(1, 80)
  label!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 200)
  locationDescription?: string;

  @Field({ nullable: true, description: 'Leave empty for a permanent code' })
  @IsOptional()
  @IsDate()
  expiresAt?: Date;
}

@InputType()
export class UpdateQrAccessPointInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 80)
  label?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 200)
  locationDescription?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  expiresAt?: Date;
}

export enum QrInvalidReason {
  NOT_FOUND = 'NOT_FOUND',
  INACTIVE = 'INACTIVE',
  EXPIRED = 'EXPIRED',
  PROPERTY_INACTIVE = 'PROPERTY_INACTIVE',
}
registerEnumType(QrInvalidReason, { name: 'QrInvalidReason' });

@ObjectType({ description: 'Result of scanning a QR code; safe to show to an unauthenticated guest' })
export class QrValidationResult {
  @Field()
  valid!: boolean;

  @Field(() => QrInvalidReason, { nullable: true })
  reason?: QrInvalidReason;

  @Field(() => ID, { nullable: true })
  propertyId?: string;

  @Field({ nullable: true })
  propertyName?: string;

  @Field({ nullable: true })
  label?: string;

  @Field(() => [String], { nullable: true })
  supportedLanguages?: string[];

  @Field({ nullable: true })
  defaultLanguage?: string;
}
