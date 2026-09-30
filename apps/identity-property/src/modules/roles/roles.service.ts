import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from './schemas/role.schema';
import { ROLE_DEFINITIONS } from './role-definitions';

@Injectable()
export class RolesService implements OnModuleInit {
  constructor(@InjectModel(Role.name) private readonly roles: Model<Role>) {}

  /** Keeps the roles collection in sync with the definitions in code. */
  async onModuleInit() {
    await this.roles.bulkWrite(
      ROLE_DEFINITIONS.map((def) => ({ updateOne: { filter: { key: def.key }, update: { $set: def }, upsert: true } })),
    );
  }

  list() {
    return this.roles.find().sort({ key: 1 });
  }
}
