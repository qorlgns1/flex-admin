import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './infrastructure/persistence/database.module';
import { configModuleOptions } from './infrastructure/config/configuration';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { ContentModule } from './modules/contents/contents.module';
import { SettingsModule } from './modules/settings/settings.module';
import { ApiModule } from './modules/apis/apis.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ...configModuleOptions,
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    ProjectsModule,
    ContentModule,
    SettingsModule,
    ApiModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
