import { ArgsType, Field, ID } from '@nestjs/graphql';
import { IsMongoId, IsOptional, IsString } from 'class-validator';

@ArgsType()
export class PropertiesArgs {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsMongoId()
  organizationId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  city?: string;
}
