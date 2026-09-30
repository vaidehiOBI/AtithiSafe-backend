import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { BASE_SCHEMA_OPTIONS } from '@app/common';

export enum ConsentType {
  /** Processing guest data to provide safety assistance; required to start a session. */
  DATA_PROCESSING = 'DATA_PROCESSING',
  /** Temporary location sharing during emergencies / safe journeys. */
  LOCATION_SHARING = 'LOCATION_SHARING',
  /** Contacting the guest's emergency contacts. */
  EMERGENCY_CONTACT_SHARING = 'EMERGENCY_CONTACT_SHARING',
}
registerEnumType(ConsentType, { name: 'ConsentType' });

/** Append-only consent history. The latest record per type is the current decision. */
@ObjectType()
@Schema({ ...BASE_SCHEMA_OPTIONS, collection: 'consents' })
export class Consent {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  guestSessionId!: Types.ObjectId;

  @Field(() => ID)
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  propertyId!: Types.ObjectId;

  @Field(() => ID)
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  organizationId!: Types.ObjectId;

  @Field(() => ConsentType)
  @Prop({ type: String, enum: ConsentType, required: true })
  type!: ConsentType;

  @Field()
  @Prop({ required: true })
  granted!: boolean;

  @Field({ description: 'Version of the policy text shown to the guest' })
  @Prop({ required: true })
  policyVersion!: string;

  @Field({ description: 'When the decision was recorded' })
  createdAt!: Date;
}

export type ConsentDocument = HydratedDocument<Consent>;
export const ConsentSchema = SchemaFactory.createForClass(Consent);
ConsentSchema.index({ guestSessionId: 1, type: 1, createdAt: -1 });
