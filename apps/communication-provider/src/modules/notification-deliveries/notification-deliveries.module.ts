import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationDelivery, NotificationDeliverySchema } from './schemas/notification-delivery.schema';
import { NotificationDeliveriesResolver } from './notification-deliveries.resolver';
import { NotificationDeliveriesService } from './notification-deliveries.service';

/** Delivery status, retries and failure alerts */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NotificationDelivery.name, schema: NotificationDeliverySchema },
    ]),
  ],
  providers: [NotificationDeliveriesResolver, NotificationDeliveriesService],
  exports: [NotificationDeliveriesService],
})
export class NotificationDeliveriesModule {}
