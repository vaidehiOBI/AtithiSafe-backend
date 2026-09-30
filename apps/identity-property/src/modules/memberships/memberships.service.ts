import { BadRequestException, ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { assertAccess, assertOperator, hasAccess, isOperator, MembershipClaim, RequestContext, StaffRole } from '@app/common';
import { assertFound, validId } from '../../common/mongo';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { OrganizationsService } from '../organizations/organizations.service';
import { PropertiesService } from '../properties/properties.service';
import { User } from '../users/schemas/user.schema';
import { AssignMembershipInput, MembershipsArgs, NewMembershipInput } from './dto/membership.inputs';
import { Membership, MembershipDocument, MembershipStatus } from './schemas/membership.schema';

interface ResolvedScope {
  role: StaffRole;
  organizationId?: string;
  propertyId?: string;
  department?: string;
}

@Injectable()
export class MembershipsService {
  constructor(
    @InjectModel(Membership.name) private readonly memberships: Model<Membership>,
    @InjectModel(User.name) private readonly users: Model<User>,
    private readonly properties: PropertiesService,
    private readonly organizations: OrganizationsService,
    private readonly audit: AuditLogsService,
  ) {}

  /**
   * Validates the role/scope combination and that the caller may grant it:
   * you can only grant a role you hold (or outrank) over the same scope.
   */
  async authorizeGrant(ctx: RequestContext, input: NewMembershipInput): Promise<ResolvedScope> {
    switch (input.role) {
      case StaffRole.ATITHISAFE_OPERATOR:
        assertOperator(ctx);
        return { role: input.role };

      case StaffRole.CHAIN_ADMIN: {
        if (!input.organizationId || input.propertyId) throw new BadRequestException('CHAIN_ADMIN needs organizationId only');
        const org = await this.organizations.getById(input.organizationId);
        assertAccess(ctx, { organizationId: org.id }, StaffRole.CHAIN_ADMIN);
        return { role: input.role, organizationId: org.id };
      }

      default: {
        if (!input.propertyId) throw new BadRequestException(`${input.role} needs propertyId`);
        const property = await this.properties.getById(input.propertyId);
        const target = this.properties.target(property);
        assertAccess(ctx, target, input.role === StaffRole.HOTEL_STAFF ? StaffRole.PROPERTY_ADMIN : input.role);
        if (input.department && !property.departments.some((d) => d.key === input.department)) {
          throw new BadRequestException(`Unknown department "${input.department}" for this property`);
        }
        return { role: input.role, ...target, department: input.department };
      }
    }
  }

  async assign(ctx: RequestContext, input: AssignMembershipInput) {
    const scope = await this.authorizeGrant(ctx, input);
    assertFound(validId(input.userId) ? await this.users.exists({ _id: input.userId }) : null, 'User');
    return this.create(ctx, input.userId, scope);
  }

  /** Persists an already-authorised grant (see authorizeGrant). */
  async create(ctx: RequestContext, userId: string | Types.ObjectId, scope: ResolvedScope) {
    const duplicate = await this.memberships.exists({
      userId,
      role: scope.role,
      organizationId: scope.organizationId ?? null,
      propertyId: scope.propertyId ?? null,
      status: MembershipStatus.ACTIVE,
    });
    if (duplicate) throw new ConflictException('User already has this role for this scope');

    const membership = await this.memberships.create({ userId, ...scope });
    await this.audit.record(ctx, {
      action: 'membership.granted',
      entityType: 'Membership',
      entityId: membership.id,
      organizationId: scope.organizationId,
      propertyId: scope.propertyId,
      changes: { userId: userId.toString(), ...scope },
    });
    return membership;
  }

  async revoke(ctx: RequestContext, id: string) {
    const membership = assertFound(validId(id) ? await this.memberships.findById(id) : null, 'Membership');
    if (membership.userId.toString() === ctx.userId) throw new BadRequestException('You cannot revoke your own membership');
    this.assertCanManage(ctx, membership);
    if (membership.status === MembershipStatus.REVOKED) return membership;

    membership.status = MembershipStatus.REVOKED;
    membership.revokedAt = new Date();
    await membership.save();
    await this.audit.record(ctx, {
      action: 'membership.revoked',
      entityType: 'Membership',
      entityId: membership.id,
      organizationId: membership.organizationId,
      propertyId: membership.propertyId,
      changes: { userId: membership.userId.toString(), role: membership.role },
    });
    return membership;
  }

  async list(ctx: RequestContext, args: MembershipsArgs) {
    const filter: FilterQuery<Membership> = {};
    if (args.propertyId) {
      const property = await this.properties.getById(args.propertyId);
      assertAccess(ctx, this.properties.target(property), StaffRole.PROPERTY_ADMIN);
      filter.propertyId = property._id;
    } else if (args.organizationId) {
      assertAccess(ctx, { organizationId: args.organizationId }, StaffRole.CHAIN_ADMIN);
      filter.organizationId = args.organizationId;
    } else {
      assertOperator(ctx);
    }
    if (!args.includeRevoked) filter.status = MembershipStatus.ACTIVE;
    return this.memberships.find(filter).sort({ createdAt: -1 });
  }

  activeForUser(userId: string | Types.ObjectId) {
    return this.memberships.find({ userId, status: MembershipStatus.ACTIVE });
  }

  userIdsWithActiveMembership(filter: FilterQuery<Membership>): Promise<Types.ObjectId[]> {
    return this.memberships.distinct('userId', { ...filter, status: MembershipStatus.ACTIVE });
  }

  /** Token claims for a user's active memberships. */
  async claimsForUser(userId: string | Types.ObjectId): Promise<MembershipClaim[]> {
    const memberships = await this.activeForUser(userId);
    return memberships.map((m) => ({
      role: m.role,
      ...(m.organizationId && { organizationId: m.organizationId.toString() }),
      ...(m.propertyId && { propertyId: m.propertyId.toString() }),
    }));
  }

  /** The caller must hold (or outrank) the membership's role over its scope. */
  canManage(ctx: RequestContext, membership: MembershipDocument): boolean {
    if (membership.role === StaffRole.ATITHISAFE_OPERATOR) return isOperator(ctx);
    const minRole = membership.role === StaffRole.HOTEL_STAFF ? StaffRole.PROPERTY_ADMIN : membership.role;
    return hasAccess(ctx, membership, minRole);
  }

  assertCanManage(ctx: RequestContext, membership: MembershipDocument) {
    if (!this.canManage(ctx, membership)) throw new ForbiddenException('You cannot manage this membership');
  }
}
