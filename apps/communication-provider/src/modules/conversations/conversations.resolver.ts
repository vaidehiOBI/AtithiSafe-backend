import { Resolver } from '@nestjs/graphql';
import { ConversationsService } from './conversations.service';

@Resolver()
export class ConversationsResolver {
  constructor(private readonly conversationsService: ConversationsService) {}
}
