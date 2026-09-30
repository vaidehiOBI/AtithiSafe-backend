import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { BASE_SCHEMA_OPTIONS } from '@app/common';

/** A printed QR code placed in the hotel (room, lobby, reception...). Scanning it starts a guest session. */
@ObjectType()
@Schema({ ...BASE_SCHEMA_OPTIONS, collection: 'qr_access_points' })
export class QrAccessPoint {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, index: true })
  propertyId!: Types.ObjectId;

  @Field(() => ID)
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  organizationId!: Types.ObjectId;

  @Field({ description: 'Random token encoded in the QR code' })
  @Prop({ required: true, unique: true })
  code!: string;

  @Field({ description: 'e.g. "Room 204", "Lobby"' })
  @Prop({ required: true, trim: true })
  label!: string;

  @Field({ nullable: true })
  @Prop({ trim: true })
  locationDescription?: string;

  @Field()
  @Prop({ default: true })
  isActive!: boolean;

  @Field({ nullable: true })
  @Prop()
  expiresAt?: Date;

  @Field(() => Int)
  @Prop({ default: 0 })
  scanCount!: number;

  @Field({ nullable: true })
  @Prop()
  lastScannedAt?: Date;

  @Field(() => ID, { nullable: true })
  @Prop({ type: MongooseSchema.Types.ObjectId })
  createdBy?: Types.ObjectId;

  @Field()
  createdAt!: Date;
}

export type QrAccessPointDocument = HydratedDocument<QrAccessPoint>;
export const QrAccessPointSchema = SchemaFactory.createForClass(QrAccessPoint);
