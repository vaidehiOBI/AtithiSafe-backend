import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProviderDocument, ProviderDocumentSchema } from './schemas/provider-document.schema';
import { ProviderDocumentsResolver } from './provider-documents.resolver';
import { ProviderDocumentsService } from './provider-documents.service';

/** Provider documents */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProviderDocument.name, schema: ProviderDocumentSchema },
    ]),
  ],
  providers: [ProviderDocumentsResolver, ProviderDocumentsService],
  exports: [ProviderDocumentsService],
})
export class ProviderDocumentsModule {}
