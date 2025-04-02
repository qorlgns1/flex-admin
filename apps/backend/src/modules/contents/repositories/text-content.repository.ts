import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TextContent } from '../entities/text-content.entity';
import { BaseRepository } from '../../../shared/repository/base.repository';

@Injectable()
export class TextContentRepository extends BaseRepository<TextContent> {
  constructor(
    @InjectRepository(TextContent)
    private readonly textContentRepository: Repository<TextContent>,
  ) {
    super(textContentRepository);
  }

  async findByProjectId(projectId: string): Promise<TextContent[]> {
    return this.textContentRepository.find({
      where: { projectId },
      order: { key: 'ASC' },
    });
  }

  async findByProjectIdAndKey(
    projectId: string,
    key: string,
  ): Promise<TextContent | null> {
    return this.textContentRepository.findOne({
      where: { projectId, key },
    });
  }
}
