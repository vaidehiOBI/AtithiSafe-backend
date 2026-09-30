import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { assertAccess, hasAccess, IncidentCategory, RequestContext, StaffRole } from '@app/common';
import { assertFound, validId } from '../../common/mongo';
import { assertCanManagePolicy, PolicyScope, resolveManagedScope } from '../../common/policy-scope';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { PropertiesService } from '../properties/properties.service';
import { CreateSopInput, SopsArgs, UpdateSopInput } from './dto/sop.types';
import { Sop, SopDocument, SopStatus } from './schemas/sop.schema';

@Injectable()
export class SopsService {
  constructor(
    @InjectModel(Sop.name) private readonly sops: Model<Sop>,
    private readonly properties: PropertiesService,
    private readonly audit: AuditLogsService,
  ) {}

  async getById(id: string): Promise<SopDocument> {
    return assertFound(validId(id) ? await this.sops.findById(id) : null, 'SOP');
  }

  async findOne(ctx: RequestContext, id: string) {
    const sop = await this.getById(id);
    if (!this.canRead(ctx, sop)) throw new ForbiddenException();
    return sop;
  }

  async list(ctx: RequestContext, args: SopsArgs) {
    const filter: FilterQuery<Sop> = {};
    if (args.propertyId) {
      const property = await this.properties.getById(args.propertyId);
      assertAccess(ctx, this.properties.target(property), StaffRole.HOTEL_STAFF);
      filter.$or = [
        { scope: PolicyScope.PROPERTY, propertyId: property._id },
        { scope: PolicyScope.ORGANIZATION, organizationId: property.organizationId },
        { scope: PolicyScope.GLOBAL },
      ];
    } else if (args.organizationId) {
      const member = ctx.memberships.some((m) => m.organizationId === args.organizationId);
      if (!member) assertAccess(ctx, { organizationId: args.organizationId }, StaffRole.CHAIN_ADMIN);
      filter.scope = PolicyScope.ORGANIZATION;
      filter.organizationId = args.organizationId;
    } else {
      filter.scope = PolicyScope.GLOBAL;
    }
    if (args.incidentCategory) filter.incidentCategory = args.incidentCategory;
    if (args.status) filter.status = args.status;
    return this.sops.find(filter).sort({ incidentCategory: 1, scope: 1, version: -1 });
  }

  /**
   * Contract for Safety Operations: getApplicableSOP(propertyId, incidentCategory).
   * Most specific published SOP wins: property -> corporate -> global.
   */
  async findApplicable(ctx: RequestContext, propertyId: string, incidentCategory: IncidentCategory): Promise<SopDocument | null> {
    const property = await this.properties.getById(propertyId);
    assertAccess(ctx, this.properties.target(property), StaffRole.HOTEL_STAFF);

    const candidates = [
      { scope: PolicyScope.PROPERTY, propertyId: property._id },
      { scope: PolicyScope.ORGANIZATION, organizationId: property.organizationId },
      { scope: PolicyScope.GLOBAL },
    ];
    for (const scope of candidates) {
      const sop = await this.sops.findOne({ ...scope, incidentCategory, status: SopStatus.PUBLISHED });
      if (sop) return sop;
    }
    return null;
  }

  async create(ctx: RequestContext, input: CreateSopInput) {
    const scope = await resolveManagedScope(ctx, this.properties, input, true);
    assertOrderedSteps(input.steps);
    const sameSeries = { scope: scope.scope, organizationId: scope.organizationId ?? null, propertyId: scope.propertyId ?? null, incidentCategory: input.incidentCategory };
    const latest = await this.sops.findOne(sameSeries).sort({ version: -1 }).select('version');

    const { propertyId, organizationId, ...content } = input;
    const sop = await this.sops.create({ ...content, ...scope, version: (latest?.version ?? 0) + 1, createdBy: ctx.userId });
    await this.record(ctx, 'sop.created', sop, { ...input });
    return sop;
  }

  /** Only drafts can be edited; published SOPs are changed by creating a new version. */
  async update(ctx: RequestContext, id: string, input: UpdateSopInput) {
    const sop = await this.getById(id);
    assertCanManagePolicy(ctx, sop);
    if (sop.status !== SopStatus.DRAFT) throw new BadRequestException('Only draft SOPs can be edited; create a new version instead');
    if (input.steps) assertOrderedSteps(input.steps);
    sop.set(input);
    await sop.save();
    await this.record(ctx, 'sop.updated', sop, { ...input });
    return sop;
  }

  /** Publishes a draft and archives the previously published version for the same scope + category. */
  async publish(ctx: RequestContext, id: string) {
    const sop = await this.getById(id);
    assertCanManagePolicy(ctx, sop);
    if (sop.status !== SopStatus.DRAFT) throw new BadRequestException('Only draft SOPs can be published');

    await this.sops.updateMany(
      { scope: sop.scope, organizationId: sop.organizationId ?? null, propertyId: sop.propertyId ?? null, incidentCategory: sop.incidentCategory, status: SopStatus.PUBLISHED },
      { status: SopStatus.ARCHIVED },
    );
    sop.status = SopStatus.PUBLISHED;
    sop.publishedAt = new Date();
    await sop.save();
    await this.record(ctx, 'sop.published', sop, { version: sop.version });
    return sop;
  }

  async archive(ctx: RequestContext, id: string) {
    const sop = await this.getById(id);
    assertCanManagePolicy(ctx, sop);
    sop.status = SopStatus.ARCHIVED;
    await sop.save();
    await this.record(ctx, 'sop.archived', sop, { version: sop.version });
    return sop;
  }

  /** Global SOPs are readable by all staff; others by staff within their scope. */
  private canRead(ctx: RequestContext, sop: SopDocument) {
    if (ctx.kind === 'service') return true;
    if (ctx.kind !== 'staff') return false;
    if (sop.scope === PolicyScope.GLOBAL) return true;
    if (sop.scope === PolicyScope.ORGANIZATION) return ctx.memberships.some((m) => m.organizationId === sop.organizationId?.toString()) || hasAccess(ctx, sop, StaffRole.CHAIN_ADMIN);
    return hasAccess(ctx, sop, StaffRole.HOTEL_STAFF);
  }

  private record(ctx: RequestContext, action: string, sop: SopDocument, changes: Record<string, unknown>) {
    return this.audit.record(ctx, { action, entityType: 'Sop', entityId: sop.id, organizationId: sop.organizationId, propertyId: sop.propertyId, changes });
  }
}

function assertOrderedSteps(steps: { order: number }[]) {
  const orders = steps.map((s) => s.order);
  if (new Set(orders).size !== orders.length) throw new BadRequestException('Step order values must be unique');
}
