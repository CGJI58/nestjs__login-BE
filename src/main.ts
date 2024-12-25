import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';

const PORT_NUMBER = process.env.PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: process.env.FE_URL, credentials: true });
  // 배포하기 전에 cloudtype 상태변수 업데이트할 것:
  // FE_URL=https://cgji58.github.io/reactjs__oauth-practice/
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  if (PORT_NUMBER) {
    await app.listen(PORT_NUMBER);
    console.log(`http://localhost:${PORT_NUMBER}`);
  } else throw new Error('Cannot get port number.');
}
bootstrap();
