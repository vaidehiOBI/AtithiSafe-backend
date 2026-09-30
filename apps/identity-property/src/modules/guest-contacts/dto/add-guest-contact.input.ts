import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsString, Length, Matches } from 'class-validator';

@InputType()
export class AddGuestContactInput {
  @Field()
  @IsString()
  @Length(1, 120)
  name!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 60)
  relationship?: string;

  @Field({ description: 'International format, e.g. +919812345678' })
  @Matches(/^\+?[0-9 ()-]{6,20}$/)
  phone!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;
}
