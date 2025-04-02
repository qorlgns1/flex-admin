// image-content.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ImageContentRepository } from '../repositories/image-content.repository';
import { ProjectsRepository } from '../../projects/repositories/project.repository';
import { CreateImageContentDto } from '../dto/image-content.dto';
import { UpdateImageContentDto } from '../dto/image-content.dto';
import { ImageContentResponseDto } from '../dto/image-content.dto';

@Injectable()
export class ImageContentService {
  constructor(
    private readonly imageContentRepository: ImageContentRepository,
    private readonly projectsRepository: ProjectsRepository,
  ) {}

  async create(
    projectId: string,
    createImageContentDto: CreateImageContentDto,
  ): Promise<ImageContentResponseDto> {
    // 프로젝트 존재 확인
    await this.projectsRepository.findById(projectId);

    // 키 중복 확인
    const existingContent =
      await this.imageContentRepository.findByProjectIdAndKey(
        projectId,
        createImageContentDto.key,
      );
    if (existingContent) {
      throw new BadRequestException(
        `Content with key '${createImageContentDto.key}' already exists`,
      );
    }

    // 이미지 콘텐츠 생성
    const imageContent = await this.imageContentRepository.create({
      projectId,
      ...createImageContentDto,
    });

    return new ImageContentResponseDto(imageContent);
  }

  async findAll(projectId: string): Promise<ImageContentResponseDto[]> {
    // 프로젝트 존재 확인
    await this.projectsRepository.findById(projectId);

    const imageContents =
      await this.imageContentRepository.findByProjectId(projectId);
    return imageContents.map((content) => new ImageContentResponseDto(content));
  }

  async findOne(
    projectId: string,
    id: string,
  ): Promise<ImageContentResponseDto> {
    const imageContent = await this.imageContentRepository.findOne({
      where: { id, projectId },
    });

    if (!imageContent) {
      throw new NotFoundException(
        `Image content with id ${id} not found in project ${projectId}`,
      );
    }

    return new ImageContentResponseDto(imageContent);
  }

  async findByKey(
    projectId: string,
    key: string,
  ): Promise<ImageContentResponseDto> {
    const imageContent =
      await this.imageContentRepository.findByProjectIdAndKey(projectId, key);

    if (!imageContent) {
      throw new NotFoundException(
        `Image content with key '${key}' not found in project ${projectId}`,
      );
    }

    return new ImageContentResponseDto(imageContent);
  }

  async update(
    projectId: string,
    id: string,
    updateImageContentDto: UpdateImageContentDto,
  ): Promise<ImageContentResponseDto> {
    // 이미지 콘텐츠 존재 확인
    await this.findOne(projectId, id);

    // 키 변경이 있는 경우 중복 확인
    if (updateImageContentDto.key) {
      const existingContent =
        await this.imageContentRepository.findByProjectIdAndKey(
          projectId,
          updateImageContentDto.key,
        );
      if (existingContent && existingContent.id !== id) {
        throw new BadRequestException(
          `Content with key '${updateImageContentDto.key}' already exists`,
        );
      }
    }

    // 업데이트 수행
    const updatedContent = await this.imageContentRepository.update(
      id,
      updateImageContentDto,
    );

    return new ImageContentResponseDto(updatedContent);
  }

  async remove(projectId: string, id: string): Promise<void> {
    // 이미지 콘텐츠 존재 확인
    await this.findOne(projectId, id);

    // 삭제 수행
    await this.imageContentRepository.remove(id);
  }
}
