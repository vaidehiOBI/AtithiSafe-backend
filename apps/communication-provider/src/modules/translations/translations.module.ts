import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageTranslation } from './entities/message-translation.entity';
import { TranslationsResolver } from './translations.resolver';
import { TranslationsService } from './translations.service';

/** Original and translated message text */
@Module({
  imports: [TypeOrmModule.forFeature([MessageTranslation])],
  providers: [TranslationsResolver, TranslationsService],
  exports: [TranslationsService],
})
export class TranslationsModule {}
