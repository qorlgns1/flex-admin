import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ImageContent } from 'src/modules/contents/entities/image-content.entity';
import { TextContent } from 'src/modules/contents/entities/text-content.entity';
import { Project } from 'src/modules/projects/entities/project.entity';
import { FeatureToggle } from 'src/modules/settings/entities/feature-toggle.entity';
import { GlobalSetting } from 'src/modules/settings/entities/global-setting.entity';
import { ProjectUser } from 'src/modules/users/entities/project-user.entity';
import { User } from 'src/modules/users/entities/user.entity';

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
    entities: [
      User,
      ProjectUser,
      Project,
      TextContent,
      ImageContent,
      GlobalSetting,
      FeatureToggle,
    ],
    synchronize: isDevelopment,
    logging: isDevelopment ? ['query', 'error', 'warn'] : ['error', 'warn'],
    ssl: !isDevelopment && useSSL ? { rejectUnauthorized: false } : undefined,
  };
};
