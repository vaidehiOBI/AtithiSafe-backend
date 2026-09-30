import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsEnum, IsString, Length } from 'class-validator';
import { ConsentType } from '../schemas/consent.schema';

@InputType()
export class RecordConsentInput {
  @Field(() => ConsentType)
  @IsEnum(ConsentType)
  type!: ConsentType;

  @Field()
  @IsBoolean()
  granted!: boolean;

  @Field()
  @IsString()
  @Length(1, 20)
  policyVersion!: string;
}
