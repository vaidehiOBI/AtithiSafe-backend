import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class HealthResolver {
  @Query(() => String, { name: 'identityPropertyHealth' })
  health(): string {
    return 'ok';
  }
}
