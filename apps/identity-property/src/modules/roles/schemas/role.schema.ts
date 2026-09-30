import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BASE_SCHEMA_OPTIONS, StaffRole } from '@app/common';

/** Reference data describing each staff role; seeded on startup. */
@ObjectType()
@Schema({ ...BASE_SCHEMA_OPTIONS, collection: 'roles' })
export class Role {
  @Field(() => ID)
  id!: string;

  @Field(() => StaffRole)
  @Prop({ type: String, enum: StaffRole, required: true, unique: true })
  key!: StaffRole;

  @Field()
  @Prop({ required: true })
  name!: string;

  @Field()
  @Prop({ required: true })
  description!: string;

  @Field(() => [String])
  @Prop({ type: [String], default: [] })
  permissions!: string[];
}

export type RoleDocument = HydratedDocument<Role>;
export const RoleSchema = SchemaFactory.createForClass(Role);
