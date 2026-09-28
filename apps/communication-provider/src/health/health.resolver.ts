import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class HealthResolver {
  @Query(() => String, { name: 'communicationProviderHealth' })
  health(): string {
    return 'ok';
  }
}
