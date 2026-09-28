import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Incident } from './entities/incident.entity';
import { IncidentsResolver } from './incidents.resolver';
import { IncidentsService } from './incidents.service';

/** Emergency alerts and incident reports; categories (medical, lost passport, scam, theft, transport, harassment); severity, status, resolution */
@Module({
  imports: [TypeOrmModule.forFeature([Incident])],
  providers: [IncidentsResolver, IncidentsService],
  exports: [IncidentsService],
})
export class IncidentsModule {}
