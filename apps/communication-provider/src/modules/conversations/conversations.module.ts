import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Conversation, ConversationSchema } from './schemas/conversation.schema';
import { ConversationsResolver } from './conversations.resolver';
import { ConversationsService } from './conversations.service';

/** Live chat conversations between guests and hotel staff */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
    ]),
  ],
  providers: [ConversationsResolver, ConversationsService],
  exports: [ConversationsService],
})
export class ConversationsModule {}
