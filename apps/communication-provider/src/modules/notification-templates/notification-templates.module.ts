import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationTemplate } from './entities/notification-template.entity';
import { NotificationTemplatesResolver } from './notification-templates.resolver';
import { NotificationTemplatesService } from './notification-templates.service';

/** Notification templates */
@Module({
  imports: [TypeOrmModule.forFeature([NotificationTemplate])],
  providers: [NotificationTemplatesResolver, NotificationTemplatesService],
  exports: [NotificationTemplatesService],
})
export class NotificationTemplatesModule {}
