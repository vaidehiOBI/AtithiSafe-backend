import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { BASE_SCHEMA_OPTIONS } from '@app/common';

/** An emergency contact a guest adds to their session (family, friend, travel agent...). */
@ObjectType()
@Schema({ ...BASE_SCHEMA_OPTIONS, collection: 'guest_contacts' })
export class GuestContact {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, index: true })
  guestSessionId!: Types.ObjectId;

  @Field(() => ID)
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  propertyId!: Types.ObjectId;

  @Field(() => ID)
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  organizationId!: Types.ObjectId;

  @Field()
  @Prop({ required: true, trim: true })
  name!: string;

  @Field({ nullable: true })
  @Prop({ trim: true })
  relationship?: string;

  @Field()
  @Prop({ required: true, trim: true })
  phone!: string;

  @Field({ nullable: true })
  @Prop({ trim: true, lowercase: true })
  email?: string;

  @Field()
  createdAt!: Date;
}

export type GuestContactDocument = HydratedDocument<GuestContact>;
export const GuestContactSchema = SchemaFactory.createForClass(GuestContact);
