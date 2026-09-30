import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageTranslation, MessageTranslationSchema } from './schemas/message-translation.schema';
import { TranslationsResolver } from './translations.resolver';
import { TranslationsService } from './translations.service';

/** Original and translated message text */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MessageTranslation.name, schema: MessageTranslationSchema },
    ]),
  ],
  providers: [TranslationsResolver, TranslationsService],
  exports: [TranslationsService],
})
export class TranslationsModule {}
