import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationDelivery } from './entities/notification-delivery.entity';
import { NotificationDeliveriesResolver } from './notification-deliveries.resolver';
import { NotificationDeliveriesService } from './notification-deliveries.service';

/** Delivery status, retries and failure alerts */
@Module({
  imports: [TypeOrmModule.forFeature([NotificationDelivery])],
  providers: [NotificationDeliveriesResolver, NotificationDeliveriesService],
  exports: [NotificationDeliveriesService],
})
export class NotificationDeliveriesModule {}
