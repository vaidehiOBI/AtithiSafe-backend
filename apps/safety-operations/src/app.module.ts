import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { contextFromHeaders } from '@app/common';
import { DatabaseModule } from './database/database.module';
import { HealthResolver } from './health/health.resolver';
import { IntegrationsModule } from './integrations/integrations.module';
import { IncidentsModule } from './modules/incidents/incidents.module';
import { AssignmentsModule } from './modules/assignments/assignments.module';
import { EscalationsModule } from './modules/escalations/escalations.module';
import { IncidentTimelineModule } from './modules/incident-timeline/incident-timeline.module';
import { SopSnapshotsModule } from './modules/sop-snapshots/sop-snapshots.module';
import { JourneysModule } from './modules/journeys/journeys.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { CheckInsModule } from './modules/check-ins/check-ins.module';
import { LocationSharingModule } from './modules/location-sharing/location-sharing.module';
import { EvidenceModule } from './modules/evidence/evidence.module';
import { ReportsModule } from './modules/reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: { federation: 2 },
      context: ({ req }: { req: { headers: Record<string, string> } }) => ({ user: contextFromHeaders(req.headers, process.env.INTERNAL_API_KEY) }),
    }),
    DatabaseModule,
    IntegrationsModule,
    IncidentsModule,
    AssignmentsModule,
    EscalationsModule,
    IncidentTimelineModule,
    SopSnapshotsModule,
    JourneysModule,
    VehiclesModule,
    CheckInsModule,
    LocationSharingModule,
    EvidenceModule,
    ReportsModule,
  ],
  providers: [HealthResolver],
})
export class AppModule {}
