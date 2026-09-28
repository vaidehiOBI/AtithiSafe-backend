import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EscalationRule } from './entities/escalation-rule.entity';
import { EscalationRulesResolver } from './escalation-rules.resolver';
import { EscalationRulesService } from './escalation-rules.service';

/** Escalation rules */
@Module({
  imports: [TypeOrmModule.forFeature([EscalationRule])],
  providers: [EscalationRulesResolver, EscalationRulesService],
  exports: [EscalationRulesService],
})
export class EscalationRulesModule {}
