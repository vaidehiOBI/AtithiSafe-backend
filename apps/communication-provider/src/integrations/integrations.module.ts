import { Global, Module } from '@nestjs/common';
import { PushAdapter } from './push/push.adapter';
import { SmsAdapter } from './sms/sms.adapter';
import { EmailAdapter } from './email/email.adapter';
import { CallAdapter } from './call/call.adapter';
import { TranslationAdapter } from './translation/translation.adapter';

@Global()
@Module({
  providers: [PushAdapter, SmsAdapter, EmailAdapter, CallAdapter, TranslationAdapter],
  exports: [PushAdapter, SmsAdapter, EmailAdapter, CallAdapter, TranslationAdapter],
})
export class IntegrationsModule {}
