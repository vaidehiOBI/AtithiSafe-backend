import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsString, Length } from 'class-validator';
import { User } from '../../users/schemas/user.schema';
import { PASSWORD_RULES } from '../../users/dto/user.inputs';

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @IsString()
  @Length(1, PASSWORD_RULES.max)
  password!: string;
}

@InputType()
export class ChangePasswordInput {
  @Field()
  @IsString()
  currentPassword!: string;

  @Field()
  @IsString()
  @Length(PASSWORD_RULES.min, PASSWORD_RULES.max)
  newPassword!: string;
}

@ObjectType()
export class AuthPayload {
  @Field({ description: 'Send as "Authorization: Bearer <token>" to the gateway' })
  accessToken!: string;

  @Field()
  expiresAt!: Date;

  @Field(() => User)
  user!: User;
}
