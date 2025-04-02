import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeatureToggle } from '../entities/feature-toggle.entity';
import { BaseRepository } from '../../../shared/repository/base.repository';

@Injectable()
export class FeatureTogglesRepository extends BaseRepository<FeatureToggle> {
  constructor(
    @InjectRepository(FeatureToggle)
    private readonly featureTogglesRepository: Repository<FeatureToggle>,
  ) {
    super(featureTogglesRepository);
  }

  async findByProjectId(projectId: string): Promise<FeatureToggle[]> {
    return this.featureTogglesRepository.find({
      where: { projectId },
      order: { key: 'ASC' },
    });
  }

  async findByProjectIdAndKey(
    projectId: string,
    key: string,
  ): Promise<FeatureToggle | null> {
    return this.featureTogglesRepository.findOne({
      where: { projectId, key },
    });
  }
}
