import { Resolver } from '@nestjs/graphql';
import { AuditLogsService } from './audit-logs.service';

@Resolver()
export class AuditLogsResolver {
  constructor(private readonly auditLogsService: AuditLogsService) {}
}
