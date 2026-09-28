import { Resolver } from '@nestjs/graphql';
import { EscalationRulesService } from './escalation-rules.service';

@Resolver()
export class EscalationRulesResolver {
  constructor(private readonly escalationRulesService: EscalationRulesService) {}
}
