import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PropertiesModule } from '../properties/properties.module';
import { EscalationRulesResolver } from './escalation-rules.resolver';
import { EscalationRulesService } from './escalation-rules.service';
import { EscalationRule, EscalationRuleSchema } from './schemas/escalation-rule.schema';

/** Escalation rules */
@Module({
  imports: [MongooseModule.forFeature([{ name: EscalationRule.name, schema: EscalationRuleSchema }]), PropertiesModule],
  providers: [EscalationRulesResolver, EscalationRulesService],
  exports: [EscalationRulesService],
})
export class EscalationRulesModule {}
