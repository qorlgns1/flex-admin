import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './shared/infrastructure/persistence/database.module';
import { configModuleOptions } from './shared/infrastructure/config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      ...configModuleOptions,
    }),
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
