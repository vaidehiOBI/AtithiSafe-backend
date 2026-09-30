import { Module } from '@nestjs/common';
import { MembershipsModule } from '../memberships/memberships.module';
import { UsersModule } from '../users/users.module';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

/** Staff login and tokens. JwtModule is registered globally in AppModule. */
@Module({
  imports: [UsersModule, MembershipsModule],
  providers: [AuthResolver, AuthService],
})
export class AuthModule {}
