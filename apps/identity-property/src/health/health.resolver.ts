import { Query, Resolver } from '@nestjs/graphql';
import { Public } from '@app/common';

@Resolver()
export class HealthResolver {
  @Public()
  @Query(() => String, { name: 'identityPropertyHealth' })
  health(): string {
    return 'ok';
  }
}
