import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Journey, JourneySchema } from './schemas/journey.schema';
import { JourneysResolver } from './journeys.resolver';
import { JourneysService } from './journeys.service';

/** Safe journeys */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Journey.name, schema: JourneySchema },
    ]),
  ],
  providers: [JourneysResolver, JourneysService],
  exports: [JourneysService],
})
export class JourneysModule {}
