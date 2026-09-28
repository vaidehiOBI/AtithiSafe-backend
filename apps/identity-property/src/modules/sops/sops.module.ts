import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sop } from './entities/sop.entity';
import { SopsResolver } from './sops.resolver';
import { SopsService } from './sops.service';

/** SOP library and corporate policy configuration */
@Module({
  imports: [TypeOrmModule.forFeature([Sop])],
  providers: [SopsResolver, SopsService],
  exports: [SopsService],
})
export class SopsModule {}
