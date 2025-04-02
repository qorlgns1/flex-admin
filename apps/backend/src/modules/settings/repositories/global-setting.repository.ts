import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GlobalSetting } from '../entities/global-setting.entity';
import { BaseRepository } from '../../../shared/repository/base.repository';

@Injectable()
export class GlobalSettingsRepository extends BaseRepository<GlobalSetting> {
  constructor(
    @InjectRepository(GlobalSetting)
    private readonly globalSettingsRepository: Repository<GlobalSetting>,
  ) {
    super(globalSettingsRepository);
  }

  async findByProjectId(projectId: string): Promise<GlobalSetting[]> {
    return this.globalSettingsRepository.find({
      where: { projectId },
      order: { key: 'ASC' },
    });
  }

  async findByProjectIdAndKey(
    projectId: string,
    key: string,
  ): Promise<GlobalSetting | null> {
    return this.globalSettingsRepository.findOne({
      where: { projectId, key },
    });
  }
}
