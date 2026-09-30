import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { BASE_SCHEMA_OPTIONS } from '@app/common';

@ObjectType()
@Schema({ ...BASE_SCHEMA_OPTIONS, collection: 'audit_logs' })
export class AuditLog {
  @Field(() => ID)
  id!: string;

  @Field()
  @Prop({ required: true })
  actorType!: string;

  @Field({ nullable: true })
  @Prop()
  actorId?: string;

  @Field()
  @Prop({ required: true })
  action!: string;

  @Field()
  @Prop({ required: true })
  entityType!: string;

  @Field()
  @Prop({ required: true })
  entityId!: string;

  @Field(() => ID, { nullable: true })
  @Prop({ type: MongooseSchema.Types.ObjectId, index: true })
  organizationId?: Types.ObjectId;

  @Field(() => ID, { nullable: true })
  @Prop({ type: MongooseSchema.Types.ObjectId, index: true })
  propertyId?: Types.ObjectId;

  /** Changed fields; exposed as a JSON string by the resolver. */
  @Prop({ type: MongooseSchema.Types.Mixed })
  changes?: Record<string, unknown>;

  @Field()
  createdAt!: Date;
}

export type AuditLogDocument = HydratedDocument<AuditLog>;
export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
AuditLogSchema.index({ organizationId: 1, createdAt: -1 });
