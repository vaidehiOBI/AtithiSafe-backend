import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { AuditLogsResolver } from './audit-logs.resolver';
import { AuditLogsService } from './audit-logs.service';

/** Audit logs for configuration and permission changes */
@Module({
  imports: [TypeOrmModule.forFeature([AuditLog])],
  providers: [AuditLogsResolver, AuditLogsService],
  exports: [AuditLogsService],
})
export class AuditLogsModule {}
