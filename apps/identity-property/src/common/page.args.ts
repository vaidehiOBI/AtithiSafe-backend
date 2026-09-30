import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsInt, Max, Min } from 'class-validator';

@ArgsType()
export class PageArgs {
  @Field(() => Int, { defaultValue: 50 })
  @IsInt()
  @Min(1)
  @Max(200)
  limit = 50;

  @Field(() => Int, { defaultValue: 0 })
  @IsInt()
  @Min(0)
  offset = 0;
}
