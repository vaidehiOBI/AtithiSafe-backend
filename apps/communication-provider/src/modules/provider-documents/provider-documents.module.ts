import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProviderDocument } from './entities/provider-document.entity';
import { ProviderDocumentsResolver } from './provider-documents.resolver';
import { ProviderDocumentsService } from './provider-documents.service';

/** Provider documents */
@Module({
  imports: [TypeOrmModule.forFeature([ProviderDocument])],
  providers: [ProviderDocumentsResolver, ProviderDocumentsService],
  exports: [ProviderDocumentsService],
})
export class ProviderDocumentsModule {}
