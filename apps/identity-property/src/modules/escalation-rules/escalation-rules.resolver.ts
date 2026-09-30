import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AllowService, CurrentUser, IncidentCategory, IncidentSeverity, RequestContext } from '@app/common';
import { CreateEscalationRuleInput, EscalationRulesArgs, UpdateEscalationRuleInput } from './dto/escalation-rule.types';
import { EscalationRulesService } from './escalation-rules.service';
import { EscalationRule } from './schemas/escalation-rule.schema';

@Resolver(() => EscalationRule)
export class EscalationRulesResolver {
  constructor(private readonly escalationRulesService: EscalationRulesService) {}

  @Query(() => [EscalationRule])
  escalationRules(@CurrentUser() ctx: RequestContext, @Args() args: EscalationRulesArgs) {
    return this.escalationRulesService.list(ctx, args);
  }

  @AllowService()
  @Query(() => EscalationRule, { nullable: true, description: 'Contract for Safety Operations: rule to apply to an incident' })
  applicableEscalationRule(
    @CurrentUser() ctx: RequestContext,
    @Args('propertyId', { type: () => ID }) propertyId: string,
    @Args('incidentCategory', { type: () => IncidentCategory }) incidentCategory: IncidentCategory,
    @Args('severity', { type: () => IncidentSeverity }) severity: IncidentSeverity,
  ) {
    return this.escalationRulesService.findApplicable(ctx, propertyId, incidentCategory, severity);
  }

  @Mutation(() => EscalationRule, { description: 'Property admins (property rule) or chain admins (organisation rule)' })
  createEscalationRule(@CurrentUser() ctx: RequestContext, @Args('input') input: CreateEscalationRuleInput) {
    return this.escalationRulesService.create(ctx, input);
  }

  @Mutation(() => EscalationRule)
  updateEscalationRule(
    @CurrentUser() ctx: RequestContext,
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateEscalationRuleInput,
  ) {
    return this.escalationRulesService.update(ctx, id, input);
  }

  @Mutation(() => EscalationRule)
  deleteEscalationRule(@CurrentUser() ctx: RequestContext, @Args('id', { type: () => ID }) id: string) {
    return this.escalationRulesService.remove(ctx, id);
  }
}
