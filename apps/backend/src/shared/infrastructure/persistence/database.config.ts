import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const isDevelopment = configService.get<string>('NODE_ENV') === 'development';
  const useSSL = configService.get<boolean>('DATABASE_SSL_ENABLED', false);

  return {
    type: 'postgres',
    host: configService.getOrThrow<string>('DATABASE_HOST'),
    port: configService.getOrThrow<number>('DATABASE_PORT'),
    username: configService.getOrThrow<string>('DATABASE_USERNAME'),
    password: configService.getOrThrow<string>('DATABASE_PASSWORD'),
    database: configService.getOrThrow<string>('DATABASE_NAME'),
    entities: [],
    synchronize: isDevelopment,
    logging: isDevelopment ? ['query', 'error', 'warn'] : ['error', 'warn'],
    ssl: !isDevelopment && useSSL ? { rejectUnauthorized: false } : undefined,
  };
};
