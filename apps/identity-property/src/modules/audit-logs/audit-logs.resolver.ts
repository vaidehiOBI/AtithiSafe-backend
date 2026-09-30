import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CurrentUser, RequestContext } from '@app/common';
import { AuditLogsService } from './audit-logs.service';
import { AuditLogsArgs } from './dto/audit-logs.args';
import { AuditLog } from './schemas/audit-log.schema';

@Resolver(() => AuditLog)
export class AuditLogsResolver {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Query(() => [AuditLog], { description: 'Property admins: pass propertyId. Chain admins: organizationId. Operators: either or none.' })
  auditLogs(@CurrentUser() ctx: RequestContext, @Args() args: AuditLogsArgs) {
    return this.auditLogsService.list(ctx, args);
  }

  @ResolveField(() => String, { nullable: true, description: 'Changed fields as JSON' })
  changes(@Parent() log: AuditLog) {
    return log.changes ? JSON.stringify(log.changes) : null;
  }
}
