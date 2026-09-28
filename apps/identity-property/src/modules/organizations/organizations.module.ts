import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { OrganizationsResolver } from './organizations.resolver';
import { OrganizationsService } from './organizations.service';

/** Hotel chains / organisations */
@Module({
  imports: [TypeOrmModule.forFeature([Organization])],
  providers: [OrganizationsResolver, OrganizationsService],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
