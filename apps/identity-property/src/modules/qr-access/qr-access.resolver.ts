import { Resolver } from '@nestjs/graphql';
import { QrAccessService } from './qr-access.service';

@Resolver()
export class QrAccessResolver {
  constructor(private readonly qrAccessService: QrAccessService) {}
}
