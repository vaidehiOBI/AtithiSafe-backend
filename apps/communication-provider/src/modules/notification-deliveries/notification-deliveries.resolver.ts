import { Resolver } from '@nestjs/graphql';
import { NotificationDeliveriesService } from './notification-deliveries.service';

@Resolver()
export class NotificationDeliveriesResolver {
  constructor(private readonly notificationDeliveriesService: NotificationDeliveriesService) {}
}
