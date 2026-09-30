import { Directive, Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BASE_SCHEMA_OPTIONS } from '@app/common';

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  DISABLED = 'DISABLED',
}
registerEnumType(UserStatus, { name: 'UserStatus' });

@ObjectType()
@Directive('@key(fields: "id")')
@Schema({ ...BASE_SCHEMA_OPTIONS, collection: 'users' })
export class User {
  @Field(() => ID)
  id!: string;

  @Field()
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email!: string;

  @Field()
  @Prop({ required: true, trim: true })
  fullName!: string;

  @Field({ nullable: true })
  @Prop({ trim: true })
  phone?: string;

  /** bcrypt hash; never selected unless explicitly requested. */
  @Prop({ required: true, select: false })
  passwordHash!: string;

  @Field(() => UserStatus)
  @Prop({ type: String, enum: UserStatus, default: UserStatus.ACTIVE })
  status!: UserStatus;

  @Field({ nullable: true })
  @Prop()
  lastLoginAt?: Date;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
