import { BadRequestException, ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { assertAccess, hasAccess, isOperator, RequestContext, StaffRole } from '@app/common';
import { RecordStatus } from '../../common/enums';
import { assertFound, validId } from '../../common/mongo';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { OrganizationsService } from '../organizations/organizations.service';
import { PropertySettingsService } from '../property-settings/property-settings.service';
import { PropertiesArgs } from './dto/properties.args';
import { CreatePropertyInput, UpdatePropertyInput } from './dto/property.inputs';
import { Department, Property, PropertyDocument } from './schemas/property.schema';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectModel(Property.name) private readonly properties: Model<Property>,
    private readonly organizations: OrganizationsService,
    private readonly settings: PropertySettingsService,
    private readonly audit: AuditLogsService,
  ) {}

  async getById(id: string): Promise<PropertyDocument> {
    return assertFound(validId(id) ? await this.properties.findById(id) : null, 'Property');
  }

  /** Staff of the property, the guest staying there, or another service. */
  async findOne(ctx: RequestContext, id: string) {
    const property = await this.getById(id);
    const guestHere = ctx.kind === 'guest' && ctx.guest?.propertyId === property.id;
    if (!guestHere && !hasAccess(ctx, this.target(property), StaffRole.HOTEL_STAFF)) throw new ForbiddenException();
    return property;
  }

  /** Properties visible to the caller, optionally narrowed by organisation / city. */
  async list(ctx: RequestContext, args: PropertiesArgs) {
    const filter: FilterQuery<Property> = {};
    if (args.organizationId) filter.organizationId = args.organizationId;
    if (args.city) filter['address.city'] = new RegExp(`^${escapeRegex(args.city)}$`, 'i');

    if (!isOperator(ctx)) {
      const orgIds = ctx.memberships.filter((m) => m.role === StaffRole.CHAIN_ADMIN).map((m) => m.organizationId);
      const propertyIds = ctx.memberships.map((m) => m.propertyId).filter(Boolean);
      filter.$or = [{ organizationId: { $in: orgIds } }, { _id: { $in: propertyIds } }];
    }
    return this.properties.find(filter).sort({ name: 1 });
  }

  async create(ctx: RequestContext, input: CreatePropertyInput) {
    const org = await this.organizations.getById(input.organizationId);
    assertAccess(ctx, { organizationId: org.id }, StaffRole.CHAIN_ADMIN);
    assertUniqueDepartments(input.departments ?? []);
    await this.assertCodeFree(org.id, input.code);

    const property = await this.properties.create({ ...input, organizationId: org.id });
    await this.settings.createDefaults(property._id, org._id);
    await this.audit.record(ctx, { action: 'property.created', entityType: 'Property', entityId: property.id, ...this.target(property), changes: { ...input } });
    return property;
  }

  async update(ctx: RequestContext, id: string, input: UpdatePropertyInput) {
    const property = await this.getById(id);
    assertAccess(ctx, this.target(property), StaffRole.PROPERTY_ADMIN);
    if (input.departments) assertUniqueDepartments(input.departments);
    if (input.code && input.code.toUpperCase() !== property.code) await this.assertCodeFree(property.organizationId.toString(), input.code);

    property.set(input);
    await property.save();
    await this.audit.record(ctx, { action: 'property.updated', entityType: 'Property', entityId: property.id, ...this.target(property), changes: { ...input } });
    return property;
  }

  async setStatus(ctx: RequestContext, id: string, status: RecordStatus) {
    const property = await this.getById(id);
    assertAccess(ctx, this.target(property), StaffRole.CHAIN_ADMIN);
    property.status = status;
    await property.save();
    await this.audit.record(ctx, { action: 'property.status_changed', entityType: 'Property', entityId: property.id, ...this.target(property), changes: { status } });
    return property;
  }

  target(property: PropertyDocument) {
    return { organizationId: property.organizationId.toString(), propertyId: property.id as string };
  }

  private async assertCodeFree(organizationId: string, code: string) {
    if (await this.properties.exists({ organizationId, code: code.toUpperCase() })) {
      throw new ConflictException(`Property code "${code}" is already used in this organization`);
    }
  }
}

function assertUniqueDepartments(departments: Department[]) {
  const keys = departments.map((d) => d.key);
  if (new Set(keys).size !== keys.length) throw new BadRequestException('Department keys must be unique');
}

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
