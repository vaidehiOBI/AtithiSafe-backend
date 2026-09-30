import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditLogsResolver } from './audit-logs.resolver';
import { AuditLogsService } from './audit-logs.service';
import { AuditLog, AuditLogSchema } from './schemas/audit-log.schema';

/** Audit logs for configuration and permission changes. Global so every module can record changes. */
@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: AuditLog.name, schema: AuditLogSchema }])],
  providers: [AuditLogsResolver, AuditLogsService],
  exports: [AuditLogsService],
})
export class AuditLogsModule {}
