import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GlobalSettingsService } from './services/global-setting.service';
import { FeatureTogglesService } from './services/feature-toggle.service';
import { GlobalSettingsController } from './controllers/global-setting.controller';
import { FeatureTogglesController } from './controllers/feature-toggle.controller';
import { GlobalSettingsRepository } from './repositories/global-setting.repository';
import { FeatureTogglesRepository } from './repositories/feature-toggle.repository';
import { GlobalSetting } from './entities/global-setting.entity';
import { FeatureToggle } from './entities/feature-toggle.entity';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GlobalSetting, FeatureToggle]),
    ProjectsModule,
  ],
  controllers: [GlobalSettingsController, FeatureTogglesController],
  providers: [
    GlobalSettingsService,
    FeatureTogglesService,
    GlobalSettingsRepository,
    FeatureTogglesRepository,
  ],
  exports: [GlobalSettingsService, FeatureTogglesService],
})
export class SettingsModule {}
