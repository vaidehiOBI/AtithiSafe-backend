import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { BASE_SCHEMA_OPTIONS, StaffRole } from '@app/common';

export enum MembershipStatus {
  ACTIVE = 'ACTIVE',
  REVOKED = 'REVOKED',
}
registerEnumType(MembershipStatus, { name: 'MembershipStatus' });

/**
 * Grants a user a role over a scope:
 * operator = platform-wide, chain admin = organisation, property admin / hotel staff = property.
 */
@ObjectType()
@Schema({ ...BASE_SCHEMA_OPTIONS, collection: 'memberships' })
export class Membership {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, index: true })
  userId!: Types.ObjectId;

  @Field(() => StaffRole)
  @Prop({ type: String, enum: StaffRole, required: true })
  role!: StaffRole;

  @Field(() => ID, { nullable: true })
  @Prop({ type: MongooseSchema.Types.ObjectId, index: true })
  organizationId?: Types.ObjectId;

  @Field(() => ID, { nullable: true })
  @Prop({ type: MongooseSchema.Types.ObjectId, index: true })
  propertyId?: Types.ObjectId;

  @Field({ nullable: true, description: 'Department key within the property, e.g. "security"' })
  @Prop()
  department?: string;

  @Field(() => MembershipStatus)
  @Prop({ type: String, enum: MembershipStatus, default: MembershipStatus.ACTIVE })
  status!: MembershipStatus;

  @Field({ nullable: true })
  @Prop()
  revokedAt?: Date;

  @Field()
  createdAt!: Date;
}

export type MembershipDocument = HydratedDocument<Membership>;
export const MembershipSchema = SchemaFactory.createForClass(Membership);
MembershipSchema.index(
  { userId: 1, role: 1, organizationId: 1, propertyId: 1 },
  { unique: true, partialFilterExpression: { status: MembershipStatus.ACTIVE } },
);
