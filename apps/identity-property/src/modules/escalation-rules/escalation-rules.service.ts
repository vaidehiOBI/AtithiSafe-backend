import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { assertAccess, IncidentCategory, IncidentSeverity, RequestContext, StaffRole } from '@app/common';
import { assertFound, validId } from '../../common/mongo';
import { assertCanManagePolicy, PolicyScope, resolveManagedScope } from '../../common/policy-scope';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { PropertiesService } from '../properties/properties.service';
import { CreateEscalationRuleInput, EscalationRulesArgs, UpdateEscalationRuleInput } from './dto/escalation-rule.types';
import { EscalationLevel, EscalationRule, EscalationRuleDocument } from './schemas/escalation-rule.schema';

@Injectable()
export class EscalationRulesService {
  constructor(
    @InjectModel(EscalationRule.name) private readonly rules: Model<EscalationRule>,
    private readonly properties: PropertiesService,
    private readonly audit: AuditLogsService,
  ) {}

  async getById(id: string): Promise<EscalationRuleDocument> {
    return assertFound(validId(id) ? await this.rules.findById(id) : null, 'Escalation rule');
  }

  async list(ctx: RequestContext, args: EscalationRulesArgs) {
    let filter: FilterQuery<EscalationRule>;
    if (args.propertyId) {
      const property = await this.properties.getById(args.propertyId);
      assertAccess(ctx, this.properties.target(property), StaffRole.HOTEL_STAFF);
      filter = { $or: [{ propertyId: property._id }, { scope: PolicyScope.ORGANIZATION, organizationId: property.organizationId }] };
    } else if (args.organizationId) {
      assertAccess(ctx, { organizationId: args.organizationId }, StaffRole.CHAIN_ADMIN);
      filter = { organizationId: args.organizationId };
    } else {
      throw new BadRequestException('propertyId or organizationId is required');
    }
    return this.rules.find(filter).sort({ scope: -1, name: 1 });
  }

  /**
   * Contract for Safety Operations: the most specific active rule for an incident.
   * Specificity: property over organisation, then exact category, then exact severity.
   */
  async findApplicable(ctx: RequestContext, propertyId: string, incidentCategory: IncidentCategory, severity: IncidentSeverity) {
    const property = await this.properties.getById(propertyId);
    assertAccess(ctx, this.properties.target(property), StaffRole.HOTEL_STAFF);

    const candidates = await this.rules.find({
      isActive: true,
      $and: [
        { $or: [{ propertyId: property._id }, { scope: PolicyScope.ORGANIZATION, organizationId: property.organizationId }] },
        { incidentCategory: { $in: [incidentCategory, null] } },
        { severity: { $in: [severity, null] } },
      ],
    });
    const score = (r: EscalationRuleDocument) => (r.propertyId ? 4 : 0) + (r.incidentCategory ? 2 : 0) + (r.severity ? 1 : 0);
    return candidates.sort((a, b) => score(b) - score(a) || b.updatedAt.getTime() - a.updatedAt.getTime())[0] ?? null;
  }

  async create(ctx: RequestContext, input: CreateEscalationRuleInput) {
    const scope = await resolveManagedScope(ctx, this.properties, input, false);
    const levels = normalizeLevels(input.levels);
    const { propertyId, organizationId, ...content } = input;
    const rule = await this.rules.create({ ...content, ...scope, levels, createdBy: ctx.userId });
    await this.record(ctx, 'escalation_rule.created', rule, { ...input });
    return rule;
  }

  async update(ctx: RequestContext, id: string, input: UpdateEscalationRuleInput) {
    const rule = await this.getById(id);
    assertCanManagePolicy(ctx, rule);
    rule.set({ ...input, ...(input.levels && { levels: normalizeLevels(input.levels) }) });
    await rule.save();
    await this.record(ctx, 'escalation_rule.updated', rule, { ...input });
    return rule;
  }

  async remove(ctx: RequestContext, id: string) {
    const rule = await this.getById(id);
    assertCanManagePolicy(ctx, rule);
    await rule.deleteOne();
    await this.record(ctx, 'escalation_rule.deleted', rule, { name: rule.name });
    return rule;
  }

  private record(ctx: RequestContext, action: string, rule: EscalationRuleDocument, changes: Record<string, unknown>) {
    return this.audit.record(ctx, { action, entityType: 'EscalationRule', entityId: rule.id, organizationId: rule.organizationId, propertyId: rule.propertyId, changes });
  }
}

/** Levels must be unique and escalate later as the level increases. */
function normalizeLevels(levels: EscalationLevel[]) {
  const sorted = [...levels].sort((a, b) => a.level - b.level);
  sorted.forEach((l, i) => {
    if (i > 0 && l.level === sorted[i - 1].level) throw new BadRequestException('Escalation levels must be unique');
    if (i > 0 && l.afterMinutes < sorted[i - 1].afterMinutes) throw new BadRequestException('Higher levels must not trigger earlier than lower levels');
    if (!l.notifyRoles.length && !l.notifyDepartments.length && !l.notifyEmergencyContacts && !l.notifyAtithiSafeOperations) {
      throw new BadRequestException(`Level ${l.level} does not notify anyone`);
    }
  });
  return sorted;
}
