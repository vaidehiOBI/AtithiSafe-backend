import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { StaffTokenPayload } from '@app/common';
import { MembershipsService } from '../memberships/memberships.service';
import { UserStatus } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { AuthPayload, LoginInput } from './dto/auth.types';

// Compared against when the email is unknown so response time doesn't reveal which emails exist.
const DUMMY_HASH = bcrypt.hashSync('atithisafe-dummy-password', 12);

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly memberships: MembershipsService,
    private readonly jwt: JwtService,
  ) {}

  async login(input: LoginInput): Promise<AuthPayload> {
    const user = await this.users.findByEmailWithPassword(input.email);
    const passwordOk = await bcrypt.compare(input.password, user?.passwordHash ?? DUMMY_HASH);
    if (!user || !passwordOk || user.status !== UserStatus.ACTIVE) throw new UnauthorizedException('Invalid email or password');

    const memberships = await this.memberships.claimsForUser(user._id);
    if (memberships.length === 0) throw new UnauthorizedException('This account has no active roles');

    const payload: StaffTokenPayload = { typ: 'staff', sub: user.id, memberships };
    const accessToken = await this.jwt.signAsync(payload);
    const { exp } = this.jwt.decode<{ exp: number }>(accessToken);
    await this.users.recordLogin(user);

    return { accessToken, expiresAt: new Date(exp * 1000), user };
  }
}
