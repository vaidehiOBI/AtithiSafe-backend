import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class HealthResolver {
  @Query(() => String, { name: 'safetyOperationsHealth' })
  health(): string {
    return 'ok';
  }
}
