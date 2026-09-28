import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuestSession } from './entities/guest-session.entity';
import { GuestSessionsResolver } from './guest-sessions.resolver';
import { GuestSessionsService } from './guest-sessions.service';

/** Guest session creation and selected language */
@Module({
  imports: [TypeOrmModule.forFeature([GuestSession])],
  providers: [GuestSessionsResolver, GuestSessionsService],
  exports: [GuestSessionsService],
})
export class GuestSessionsModule {}
