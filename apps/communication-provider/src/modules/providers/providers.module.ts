import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Provider, ProviderSchema } from './schemas/provider.schema';
import { ProvidersResolver } from './providers.resolver';
import { ProvidersService } from './providers.service';

/** Provider directory and search (property, city, category, verified status) */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Provider.name, schema: ProviderSchema },
    ]),
  ],
  providers: [ProvidersResolver, ProvidersService],
  exports: [ProvidersService],
})
export class ProvidersModule {}
