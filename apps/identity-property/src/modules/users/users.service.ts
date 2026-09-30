import { ConflictException, ForbiddenException, Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { assertAccess, assertOperator, RequestContext, StaffRole } from '@app/common';
import { assertFound, validId } from '../../common/mongo';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { MembershipsService } from '../memberships/memberships.service';
import { PropertiesService } from '../properties/properties.service';
import { CreateStaffUserInput, UpdateUserInput, UsersArgs } from './dto/user.inputs';
import { User, UserDocument, UserStatus } from './schemas/user.schema';

const BCRYPT_ROUNDS = 12;

@Injectable()
export class UsersService implements OnApplicationBootstrap {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name) private readonly users: Model<User>,
    private readonly memberships: MembershipsService,
    private readonly properties: PropertiesService,
    private readonly audit: AuditLogsService,
    private readonly config: ConfigService,
  ) {}

  /** Creates the first AtithiSafe operator from SEED_OPERATOR_* env vars when the database has no users. */
  async onApplicationBootstrap() {
    const email = this.config.get<string>('SEED_OPERATOR_EMAIL');
    const password = this.config.get<string>('SEED_OPERATOR_PASSWORD');
    if (!email || !password || (await this.users.estimatedDocumentCount()) > 0) return;

    const user = await this.users.create({ email, fullName: 'AtithiSafe Operator', passwordHash: await hashPassword(password) });
    await this.memberships.create({ kind: 'service', memberships: [], serviceName: 'seed' }, user._id, { role: StaffRole.ATITHISAFE_OPERATOR });
    this.logger.log(`Seeded operator account ${email}`);
  }

  async getById(id: string): Promise<UserDocument> {
    return assertFound(validId(id) ? await this.users.findById(id) : null, 'User');
  }

  findByEmailWithPassword(email: string) {
    return this.users.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash');
  }

  /** Yourself, or someone who can manage every role the user holds. */
  async findOne(ctx: RequestContext, id: string) {
    const user = await this.getById(id);
    if (user.id !== ctx.userId) await this.assertCanManageUser(ctx, user);
    return user;
  }

  async list(ctx: RequestContext, args: UsersArgs) {
    let ids;
    if (args.propertyId) {
      const property = await this.properties.getById(args.propertyId);
      assertAccess(ctx, this.properties.target(property), StaffRole.PROPERTY_ADMIN);
      ids = await this.memberships.userIdsWithActiveMembership({ propertyId: property._id });
    } else if (args.organizationId) {
      assertAccess(ctx, { organizationId: args.organizationId }, StaffRole.CHAIN_ADMIN);
      ids = await this.memberships.userIdsWithActiveMembership({ organizationId: args.organizationId });
    } else {
      assertOperator(ctx);
      return this.users.find().sort({ fullName: 1 });
    }
    return this.users.find({ _id: { $in: ids } }).sort({ fullName: 1 });
  }

  async createStaffUser(ctx: RequestContext, input: CreateStaffUserInput) {
    const scope = await this.memberships.authorizeGrant(ctx, input.membership);
    const email = input.email.toLowerCase().trim();
    if (await this.users.exists({ email })) throw new ConflictException('A user with this email already exists; use assignMembership instead');

    const user = await this.users.create({ email, fullName: input.fullName, phone: input.phone, passwordHash: await hashPassword(input.password) });
    await this.audit.record(ctx, {
      action: 'user.created',
      entityType: 'User',
      entityId: user.id,
      organizationId: scope.organizationId,
      propertyId: scope.propertyId,
      changes: { email, fullName: input.fullName },
    });
    await this.memberships.create(ctx, user._id, scope);
    return user;
  }

  async update(ctx: RequestContext, id: string, input: UpdateUserInput) {
    const user = await this.getById(id);
    if (user.id !== ctx.userId) await this.assertCanManageUser(ctx, user);
    user.set(input);
    await user.save();
    await this.audit.record(ctx, { action: 'user.updated', entityType: 'User', entityId: user.id, changes: { ...input } });
    return user;
  }

  async setStatus(ctx: RequestContext, id: string, status: UserStatus) {
    const user = await this.getById(id);
    if (user.id === ctx.userId) throw new ForbiddenException('You cannot change your own status');
    await this.assertCanManageUser(ctx, user);
    user.status = status;
    await user.save();
    await this.audit.record(ctx, { action: 'user.status_changed', entityType: 'User', entityId: user.id, changes: { status } });
    return user;
  }

  async changePassword(ctx: RequestContext, currentPassword: string, newPassword: string) {
    const user = assertFound(ctx.userId ? await this.users.findById(ctx.userId).select('+passwordHash') : null, 'User');
    if (!(await bcrypt.compare(currentPassword, user.passwordHash))) throw new ForbiddenException('Current password is incorrect');
    user.passwordHash = await hashPassword(newPassword);
    await user.save();
    await this.audit.record(ctx, { action: 'user.password_changed', entityType: 'User', entityId: user.id });
    return true;
  }

  async recordLogin(user: UserDocument) {
    await this.users.updateOne({ _id: user._id }, { lastLoginAt: new Date() });
  }

  /** Managing a user requires authority over every active role they hold. */
  private async assertCanManageUser(ctx: RequestContext, user: UserDocument) {
    const memberships = await this.memberships.activeForUser(user._id);
    const allowed = memberships.length > 0 ? memberships.every((m) => this.memberships.canManage(ctx, m)) : ctx.kind === 'service';
    if (!allowed) assertOperator(ctx);
  }
}

export const hashPassword = (password: string) => bcrypt.hash(password, BCRYPT_ROUNDS);
