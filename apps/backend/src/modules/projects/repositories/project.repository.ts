import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';
import { BaseRepository } from '../../../shared/repository/base.repository';

@Injectable()
export class ProjectsRepository extends BaseRepository<Project> {
  constructor(
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
  ) {
    super(projectsRepository);
  }

  async findByApiKey(apiKey: string): Promise<Project | null> {
    return this.projectsRepository.findOne({
      where: { apiKey },
    });
  }

  async findWithRelations(id: string): Promise<Project | null> {
    return this.projectsRepository.findOne({
      where: { id },
      relations: [
        'projectUsers',
        'projectUsers.user',
        'textContents',
        'imageContents',
        'globalSettings',
        'featureToggles',
      ],
    });
  }
}
