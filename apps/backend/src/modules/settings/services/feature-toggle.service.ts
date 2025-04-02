import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FeatureTogglesRepository } from '../repositories/feature-toggle.repository';
import { ProjectsRepository } from '../../projects/repositories/project.repository';
import { CreateFeatureToggleDto } from '../dto/feature-toggle.dto';
import { UpdateFeatureToggleDto } from '../dto/feature-toggle.dto';
import { FeatureToggleResponseDto } from '../dto/feature-toggle.dto';

@Injectable()
export class FeatureTogglesService {
  constructor(
    private readonly featureTogglesRepository: FeatureTogglesRepository,
    private readonly projectsRepository: ProjectsRepository,
  ) {}

  async create(
    projectId: string,
    createFeatureToggleDto: CreateFeatureToggleDto,
  ): Promise<FeatureToggleResponseDto> {
    // 프로젝트 존재 확인
    await this.projectsRepository.findById(projectId);

    // 키 중복 확인
    const existingToggle =
      await this.featureTogglesRepository.findByProjectIdAndKey(
        projectId,
        createFeatureToggleDto.key,
      );
    if (existingToggle) {
      throw new BadRequestException(
        `Feature toggle with key '${createFeatureToggleDto.key}' already exists`,
      );
    }

    // 기능 토글 생성
    const toggle = await this.featureTogglesRepository.create({
      projectId,
      ...createFeatureToggleDto,
    });

    return new FeatureToggleResponseDto(toggle);
  }

  async findAll(projectId: string): Promise<FeatureToggleResponseDto[]> {
    // 프로젝트 존재 확인
    await this.projectsRepository.findById(projectId);

    const toggles =
      await this.featureTogglesRepository.findByProjectId(projectId);
    return toggles.map((toggle) => new FeatureToggleResponseDto(toggle));
  }

  async findOne(
    projectId: string,
    id: string,
  ): Promise<FeatureToggleResponseDto> {
    const toggle = await this.featureTogglesRepository.findOne({
      where: { id, projectId },
    });

    if (!toggle) {
      throw new NotFoundException(
        `Feature toggle with id ${id} not found in project ${projectId}`,
      );
    }

    return new FeatureToggleResponseDto(toggle);
  }

  async findByKey(
    projectId: string,
    key: string,
  ): Promise<FeatureToggleResponseDto> {
    const toggle = await this.featureTogglesRepository.findByProjectIdAndKey(
      projectId,
      key,
    );

    if (!toggle) {
      throw new NotFoundException(
        `Feature toggle with key '${key}' not found in project ${projectId}`,
      );
    }

    return new FeatureToggleResponseDto(toggle);
  }

  async update(
    projectId: string,
    id: string,
    updateFeatureToggleDto: UpdateFeatureToggleDto,
  ): Promise<FeatureToggleResponseDto> {
    // 기능 토글 존재 확인
    await this.findOne(projectId, id);

    // 키 변경이 있는 경우 중복 확인
    if (updateFeatureToggleDto.key) {
      const existingToggle =
        await this.featureTogglesRepository.findByProjectIdAndKey(
          projectId,
          updateFeatureToggleDto.key,
        );
      if (existingToggle && existingToggle.id !== id) {
        throw new BadRequestException(
          `Feature toggle with key '${updateFeatureToggleDto.key}' already exists`,
        );
      }
    }

    // 업데이트 수행
    const updatedToggle = await this.featureTogglesRepository.update(
      id,
      updateFeatureToggleDto,
    );

    return new FeatureToggleResponseDto(updatedToggle);
  }

  async remove(projectId: string, id: string): Promise<void> {
    // 기능 토글 존재 확인
    await this.findOne(projectId, id);

    // 삭제 수행
    await this.featureTogglesRepository.remove(id);
  }
}
