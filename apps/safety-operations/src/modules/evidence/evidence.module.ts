import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvidenceFile } from './entities/evidence-file.entity';
import { EvidenceResolver } from './evidence.resolver';
import { EvidenceService } from './evidence.service';

/** Evidence metadata and secure uploads (photos, documents, verification images) */
@Module({
  imports: [TypeOrmModule.forFeature([EvidenceFile])],
  providers: [EvidenceResolver, EvidenceService],
  exports: [EvidenceService],
})
export class EvidenceModule {}
