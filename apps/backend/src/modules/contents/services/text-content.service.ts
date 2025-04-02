import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TextContentRepository } from '../repositories/text-content.repository';
import { ProjectsRepository } from '../../projects/repositories/project.repository';
import { CreateTextContentDto } from '../dto/text-content.dto';
import { UpdateTextContentDto } from '../dto/text-content.dto';
import { TextContentResponseDto } from '../dto/text-content.dto';

@Injectable()
export class TextContentService {
  constructor(
    private readonly textContentRepository: TextContentRepository,
    private readonly projectsRepository: ProjectsRepository,
  ) {}

  async create(
    projectId: string,
    createTextContentDto: CreateTextContentDto,
  ): Promise<TextContentResponseDto> {
    // 프로젝트 존재 확인
    await this.projectsRepository.findById(projectId);

    // 키 중복 확인
    const existingContent =
      await this.textContentRepository.findByProjectIdAndKey(
        projectId,
        createTextContentDto.key,
      );
    if (existingContent) {
      throw new BadRequestException(
        `Content with key '${createTextContentDto.key}' already exists`,
      );
    }

    // 텍스트 콘텐츠 생성
    const textContent = await this.textContentRepository.create({
      projectId,
      ...createTextContentDto,
    });

    return new TextContentResponseDto(textContent);
  }

  async findAll(projectId: string): Promise<TextContentResponseDto[]> {
    // 프로젝트 존재 확인
    await this.projectsRepository.findById(projectId);

    const textContents =
      await this.textContentRepository.findByProjectId(projectId);
    return textContents.map((content) => new TextContentResponseDto(content));
  }

  async findOne(
    projectId: string,
    id: string,
  ): Promise<TextContentResponseDto> {
    const textContent = await this.textContentRepository.findOne({
      where: { id, projectId },
    });

    if (!textContent) {
      throw new NotFoundException(
        `Text content with id ${id} not found in project ${projectId}`,
      );
    }

    return new TextContentResponseDto(textContent);
  }

  async findByKey(
    projectId: string,
    key: string,
  ): Promise<TextContentResponseDto> {
    const textContent = await this.textContentRepository.findByProjectIdAndKey(
      projectId,
      key,
    );

    if (!textContent) {
      throw new NotFoundException(
        `Text content with key '${key}' not found in project ${projectId}`,
      );
    }

    return new TextContentResponseDto(textContent);
  }

  async update(
    projectId: string,
    id: string,
    updateTextContentDto: UpdateTextContentDto,
  ): Promise<TextContentResponseDto> {
    // 텍스트 콘텐츠 존재 확인
    await this.findOne(projectId, id);

    // 키 변경이 있는 경우 중복 확인
    if (updateTextContentDto.key) {
      const existingContent =
        await this.textContentRepository.findByProjectIdAndKey(
          projectId,
          updateTextContentDto.key,
        );
      if (existingContent && existingContent.id !== id) {
        throw new BadRequestException(
          `Content with key '${updateTextContentDto.key}' already exists`,
        );
      }
    }

    // 업데이트 수행
    const updatedContent = await this.textContentRepository.update(
      id,
      updateTextContentDto,
    );

    return new TextContentResponseDto(updatedContent);
  }

  async remove(projectId: string, id: string): Promise<void> {
    // 텍스트 콘텐츠 존재 확인
    await this.findOne(projectId, id);

    // 삭제 수행
    await this.textContentRepository.remove(id);
  }
}
