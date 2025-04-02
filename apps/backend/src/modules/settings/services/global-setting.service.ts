import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GlobalSettingsRepository } from '../repositories/global-setting.repository';
import { ProjectsRepository } from '../../projects/repositories/project.repository';
import { CreateGlobalSettingDto } from '../dto/global-setting.dto';
import { UpdateGlobalSettingDto } from '../dto/global-setting.dto';
import { GlobalSettingResponseDto } from '../dto/global-setting.dto';

@Injectable()
export class GlobalSettingsService {
  constructor(
    private readonly globalSettingsRepository: GlobalSettingsRepository,
    private readonly projectsRepository: ProjectsRepository,
  ) {}

  async create(
    projectId: string,
    createGlobalSettingDto: CreateGlobalSettingDto,
  ): Promise<GlobalSettingResponseDto> {
    // 프로젝트 존재 확인
    await this.projectsRepository.findById(projectId);

    // 키 중복 확인
    const existingSetting =
      await this.globalSettingsRepository.findByProjectIdAndKey(
        projectId,
        createGlobalSettingDto.key,
      );
    if (existingSetting) {
      throw new BadRequestException(
        `Setting with key '${createGlobalSettingDto.key}' already exists`,
      );
    }

    // 설정 생성
    const setting = await this.globalSettingsRepository.create({
      projectId,
      ...createGlobalSettingDto,
    });

    return new GlobalSettingResponseDto(setting);
  }

  async findAll(projectId: string): Promise<GlobalSettingResponseDto[]> {
    // 프로젝트 존재 확인
    await this.projectsRepository.findById(projectId);

    const settings =
      await this.globalSettingsRepository.findByProjectId(projectId);
    return settings.map((setting) => new GlobalSettingResponseDto(setting));
  }

  async findOne(
    projectId: string,
    id: string,
  ): Promise<GlobalSettingResponseDto> {
    const setting = await this.globalSettingsRepository.findOne({
      where: { id, projectId },
    });

    if (!setting) {
      throw new NotFoundException(
        `Global setting with id ${id} not found in project ${projectId}`,
      );
    }

    return new GlobalSettingResponseDto(setting);
  }

  async findByKey(
    projectId: string,
    key: string,
  ): Promise<GlobalSettingResponseDto> {
    const setting = await this.globalSettingsRepository.findByProjectIdAndKey(
      projectId,
      key,
    );

    if (!setting) {
      throw new NotFoundException(
        `Global setting with key '${key}' not found in project ${projectId}`,
      );
    }

    return new GlobalSettingResponseDto(setting);
  }

  async update(
    projectId: string,
    id: string,
    updateGlobalSettingDto: UpdateGlobalSettingDto,
  ): Promise<GlobalSettingResponseDto> {
    // 설정 존재 확인
    await this.findOne(projectId, id);

    // 키 변경이 있는 경우 중복 확인
    if (updateGlobalSettingDto.key) {
      const existingSetting =
        await this.globalSettingsRepository.findByProjectIdAndKey(
          projectId,
          updateGlobalSettingDto.key,
        );
      if (existingSetting && existingSetting.id !== id) {
        throw new BadRequestException(
          `Setting with key '${updateGlobalSettingDto.key}' already exists`,
        );
      }
    }

    // 업데이트 수행
    const updatedSetting = await this.globalSettingsRepository.update(
      id,
      updateGlobalSettingDto,
    );

    return new GlobalSettingResponseDto(updatedSetting);
  }

  async remove(projectId: string, id: string): Promise<void> {
    // 설정 존재 확인
    await this.findOne(projectId, id);

    // 삭제 수행
    await this.globalSettingsRepository.remove(id);
  }
}
