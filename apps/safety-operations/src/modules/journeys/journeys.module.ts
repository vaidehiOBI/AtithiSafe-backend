import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Journey } from './entities/journey.entity';
import { JourneysResolver } from './journeys.resolver';
import { JourneysService } from './journeys.service';

/** Safe journeys */
@Module({
  imports: [TypeOrmModule.forFeature([Journey])],
  providers: [JourneysResolver, JourneysService],
  exports: [JourneysService],
})
export class JourneysModule {}
