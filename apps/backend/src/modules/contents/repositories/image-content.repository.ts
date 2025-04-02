import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImageContent } from '../entities/image-content.entity';
import { BaseRepository } from '../../../shared/repository/base.repository';

@Injectable()
export class ImageContentRepository extends BaseRepository<ImageContent> {
  constructor(
    @InjectRepository(ImageContent)
    private readonly imageContentRepository: Repository<ImageContent>,
  ) {
    super(imageContentRepository);
  }

  async findByProjectId(projectId: string): Promise<ImageContent[]> {
    return this.imageContentRepository.find({
      where: { projectId },
      order: { key: 'ASC' },
    });
  }

  async findByProjectIdAndKey(
    projectId: string,
    key: string,
  ): Promise<ImageContent | null> {
    return this.imageContentRepository.findOne({
      where: { projectId, key },
    });
  }
}
