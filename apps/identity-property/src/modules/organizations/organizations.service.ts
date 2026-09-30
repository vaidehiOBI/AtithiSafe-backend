import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { assertAccess, assertOperator, isOperator, RequestContext, StaffRole } from '@app/common';
import { assertFound, validId } from '../../common/mongo';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { CreateOrganizationInput, UpdateOrganizationInput } from './dto/organization.inputs';
import { Organization, OrganizationDocument } from './schemas/organization.schema';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectModel(Organization.name) private readonly organizations: Model<Organization>,
    private readonly audit: AuditLogsService,
  ) {}

  async getById(id: string): Promise<OrganizationDocument> {
    return assertFound(validId(id) ? await this.organizations.findById(id) : null, 'Organization');
  }

  /** Any staff member belonging to the organisation (or its properties) can read it. */
  async findOne(ctx: RequestContext, id: string) {
    const org = await this.getById(id);
    const member = ctx.memberships.some((m) => m.organizationId === org.id);
    if (!member && ctx.kind !== 'service') assertAccess(ctx, { organizationId: org.id }, StaffRole.CHAIN_ADMIN);
    return org;
  }

  async list(ctx: RequestContext) {
    if (isOperator(ctx)) return this.organizations.find().sort({ name: 1 });
    const ids = [...new Set(ctx.memberships.map((m) => m.organizationId).filter(Boolean))];
    return this.organizations.find({ _id: { $in: ids } }).sort({ name: 1 });
  }

  async create(ctx: RequestContext, input: CreateOrganizationInput) {
    assertOperator(ctx);
    await this.assertSlugFree(input.slug);
    const org = await this.organizations.create(input);
    await this.audit.record(ctx, { action: 'organization.created', entityType: 'Organization', entityId: org.id, organizationId: org.id, changes: { ...input } });
    return org;
  }

  async update(ctx: RequestContext, id: string, input: UpdateOrganizationInput) {
    const org = await this.getById(id);
    assertAccess(ctx, { organizationId: org.id }, StaffRole.CHAIN_ADMIN);
    if (input.status) assertOperator(ctx);
    if (input.slug && input.slug !== org.slug) await this.assertSlugFree(input.slug);
    org.set(input);
    await org.save();
    await this.audit.record(ctx, { action: 'organization.updated', entityType: 'Organization', entityId: org.id, organizationId: org.id, changes: { ...input } });
    return org;
  }

  private async assertSlugFree(slug: string) {
    if (await this.organizations.exists({ slug })) throw new ConflictException(`Organization slug "${slug}" is already taken`);
  }
}
