import { Module } from '@nestjs/common';
import { ApiService } from './services/api.service';
import { ApiController } from './controllers/api.controller';
import { ContentModule } from '../contents/contents.module';
import { SettingsModule } from '../settings/settings.module';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [ContentModule, SettingsModule, ProjectsModule],
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule {}
