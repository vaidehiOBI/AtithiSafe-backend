import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { assertAccess, assertOperator, RequestContext, StaffRole } from '@app/common';
import { AuditLogsArgs } from './dto/audit-logs.args';
import { AuditLog } from './schemas/audit-log.schema';

type IdLike = { toString(): string } | string | null | undefined;

export interface AuditEntry {
  action: string;
  entityType: string;
  entityId: IdLike;
  organizationId?: IdLike;
  propertyId?: IdLike;
  changes?: Record<string, unknown>;
}

@Injectable()
export class AuditLogsService {
  private readonly logger = new Logger(AuditLogsService.name);

  constructor(@InjectModel(AuditLog.name) private readonly auditLogs: Model<AuditLog>) {}

  /** Records a configuration or permission change. Never fails the calling operation. */
  async record(ctx: RequestContext, entry: AuditEntry): Promise<void> {
    try {
      await this.auditLogs.create({
        actorType: ctx.kind,
        actorId: ctx.userId ?? ctx.guest?.sessionId ?? ctx.serviceName,
        action: entry.action,
        entityType: entry.entityType,
        entityId: entry.entityId?.toString(),
        organizationId: entry.organizationId ?? undefined,
        propertyId: entry.propertyId ?? undefined,
        changes: entry.changes,
      });
    } catch (err) {
      this.logger.error(`Failed to write audit log for ${entry.action}`, err as Error);
    }
  }

  async list(ctx: RequestContext, args: AuditLogsArgs) {
    const filter: FilterQuery<AuditLog> = {};
    if (args.propertyId) {
      assertAccess(ctx, { propertyId: args.propertyId, organizationId: args.organizationId }, StaffRole.PROPERTY_ADMIN);
      filter.propertyId = args.propertyId;
    } else if (args.organizationId) {
      assertAccess(ctx, { organizationId: args.organizationId }, StaffRole.CHAIN_ADMIN);
      filter.organizationId = args.organizationId;
    } else {
      assertOperator(ctx);
    }
    if (args.entityType) filter.entityType = args.entityType;
    return this.auditLogs.find(filter).sort({ createdAt: -1 }).skip(args.offset).limit(args.limit);
  }
}
