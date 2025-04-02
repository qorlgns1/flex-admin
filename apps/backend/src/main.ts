import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

void bootstrap();

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // 전역 설정 적용
  setupGlobalMiddleware(app);
  setupGlobalPipes(app);
  app.setGlobalPrefix('api/');
  setupSwagger(app, configService);

  // 서버 시작
  const port: number = configService.get('PORT') || 9000;
  await app.listen(port);

  // 시작 로그 출력
  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(
    `API Documentation available at: http://localhost:${port}/api-docs`,
  );
}

// ------------------------------------------------------------------------------------------------

/**
 * 전역 미들웨어 설정을 적용합니다.
 * @param app NestJS 애플리케이션 인스턴스
 */
function setupGlobalMiddleware(app: INestApplication): void {
  app.use(helmet());
  app.enableCors();
}

/**
 * 전역 파이프 설정을 적용합니다.
 * @param app NestJS 애플리케이션 인스턴스
 */
function setupGlobalPipes(app: INestApplication): void {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
}

/**
 * Swagger 문서 설정을 적용합니다.
 * @param app NestJS 애플리케이션 인스턴스
 * @param configService 설정 서비스 인스턴스
 */
function setupSwagger(
  app: INestApplication,
  configService: ConfigService,
): void {
  if (configService.get('NODE_ENV') === 'production') return;

  const config = new DocumentBuilder()
    .setTitle('FLEX-ADMIN API')
    .setDescription('올인원 어드민 플랫폼 API 문서')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
}

/**
 * 애플리케이션을 시작하고 서버를 실행합니다.
 */
