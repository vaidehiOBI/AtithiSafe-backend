import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PropertiesModule } from '../properties/properties.module';
import { Sop, SopSchema } from './schemas/sop.schema';
import { SopsResolver } from './sops.resolver';
import { SopsService } from './sops.service';

/** SOP library and corporate policy configuration */
@Module({
  imports: [MongooseModule.forFeature([{ name: Sop.name, schema: SopSchema }]), PropertiesModule],
  providers: [SopsResolver, SopsService],
  exports: [SopsService],
})
export class SopsModule {}
