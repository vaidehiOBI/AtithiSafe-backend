import { Resolver } from '@nestjs/graphql';
import { TranslationsService } from './translations.service';

@Resolver()
export class TranslationsResolver {
  constructor(private readonly translationsService: TranslationsService) {}
}
