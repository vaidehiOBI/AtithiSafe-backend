import { Resolver } from '@nestjs/graphql';
import { NotificationTemplatesService } from './notification-templates.service';

@Resolver()
export class NotificationTemplatesResolver {
  constructor(private readonly notificationTemplatesService: NotificationTemplatesService) {}
}
