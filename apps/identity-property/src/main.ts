import { BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/** "membership.role: role must be one of ..." instead of a generic "Bad Request Exception". */
function flatten(errors: ValidationError[], prefix = ''): string[] {
  return errors.flatMap((e) => [
    ...Object.values(e.constraints ?? {}).map((msg) => `${prefix}${e.property}: ${msg}`),
    ...flatten(e.children ?? [], `${prefix}${e.property}.`),
  ]);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors) => new BadRequestException(flatten(errors).join('; ')),
    }),
  );
  await app.listen(process.env.PORT ?? 4001);
}
bootstrap();
