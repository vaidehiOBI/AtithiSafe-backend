import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QrAccessPoint } from './entities/qr-access-point.entity';
import { QrAccessResolver } from './qr-access.resolver';
import { QrAccessService } from './qr-access.service';

/** Guest QR creation, expiry and scan validation */
@Module({
  imports: [TypeOrmModule.forFeature([QrAccessPoint])],
  providers: [QrAccessResolver, QrAccessService],
  exports: [QrAccessService],
})
export class QrAccessModule {}
