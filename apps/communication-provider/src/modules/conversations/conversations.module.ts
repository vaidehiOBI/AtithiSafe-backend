import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { ConversationsResolver } from './conversations.resolver';
import { ConversationsService } from './conversations.service';

/** Live chat conversations between guests and hotel staff */
@Module({
  imports: [TypeOrmModule.forFeature([Conversation])],
  providers: [ConversationsResolver, ConversationsService],
  exports: [ConversationsService],
})
export class ConversationsModule {}
