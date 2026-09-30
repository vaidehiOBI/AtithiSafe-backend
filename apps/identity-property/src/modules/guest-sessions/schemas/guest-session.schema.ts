import { Directive, Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { BASE_SCHEMA_OPTIONS } from '@app/common';

export enum GuestSessionStatus {
  ACTIVE = 'ACTIVE',
  ENDED = 'ENDED',
  EXPIRED = 'EXPIRED',
}
registerEnumType(GuestSessionStatus, { name: 'GuestSessionStatus' });

/** A guest's stay-scoped access, started by scanning a hotel QR code. Guests have no account. */
@ObjectType()
@Directive('@key(fields: "id")')
@Schema({ ...BASE_SCHEMA_OPTIONS, collection: 'guest_sessions' })
export class GuestSession {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, index: true })
  propertyId!: Types.ObjectId;

  @Field(() => ID)
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  organizationId!: Types.ObjectId;

  @Field(() => ID)
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  qrAccessPointId!: Types.ObjectId;

  @Field({ description: 'Selected language, e.g. "en", "hi", "fr"' })
  @Prop({ required: true })
  language!: string;

  @Field({ nullable: true })
  @Prop({ trim: true })
  guestName?: string;

  @Field({ nullable: true })
  @Prop({ trim: true })
  roomNumber?: string;

  @Field({ nullable: true })
  @Prop({ trim: true })
  phone?: string;

  /** Stored status; ACTIVE sessions past expiresAt are reported as EXPIRED by the resolver. */
  @Prop({ type: String, enum: [GuestSessionStatus.ACTIVE, GuestSessionStatus.ENDED], default: GuestSessionStatus.ACTIVE })
  status!: GuestSessionStatus;

  @Field()
  @Prop({ required: true, index: true })
  expiresAt!: Date;

  @Field({ nullable: true })
  @Prop()
  endedAt?: Date;

  @Field({ description: 'When the session started' })
  createdAt!: Date;
}

export type GuestSessionDocument = HydratedDocument<GuestSession>;
export const GuestSessionSchema = SchemaFactory.createForClass(GuestSession);
GuestSessionSchema.index({ propertyId: 1, createdAt: -1 });

export const effectiveStatus = (s: Pick<GuestSession, 'status' | 'expiresAt'>) =>
  s.status === GuestSessionStatus.ACTIVE && s.expiresAt <= new Date() ? GuestSessionStatus.EXPIRED : s.status;
