import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EvidenceFile, EvidenceFileSchema } from './schemas/evidence-file.schema';
import { EvidenceResolver } from './evidence.resolver';
import { EvidenceService } from './evidence.service';

/** Evidence metadata and secure uploads (photos, documents, verification images) */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EvidenceFile.name, schema: EvidenceFileSchema },
    ]),
  ],
  providers: [EvidenceResolver, EvidenceService],
  exports: [EvidenceService],
})
export class EvidenceModule {}
