import { Global, Module } from '@nestjs/common';
import { IdentityPropertyClient } from './identity-property/identity-property.client';
import { StorageClient } from './storage/storage.client';

@Global()
@Module({
  providers: [IdentityPropertyClient, StorageClient],
  exports: [IdentityPropertyClient, StorageClient],
})
export class IntegrationsModule {}
