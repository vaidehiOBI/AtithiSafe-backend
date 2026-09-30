import { ArgsType, Field, ID } from '@nestjs/graphql';
import { IsMongoId, IsOptional, IsString } from 'class-validator';
import { PageArgs } from '../../../common/page.args';

@ArgsType()
export class AuditLogsArgs extends PageArgs {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsMongoId()
  organizationId?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsMongoId()
  propertyId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  entityType?: string;
}
