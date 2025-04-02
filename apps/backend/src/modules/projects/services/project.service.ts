import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ProjectsRepository } from '../repositories/project.repository';
import { ProjectUsersRepository } from '../../users/repositories/project-user.repository';
import { UsersRepository } from '../../users/repositories/user.repository';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { ProjectResponseDto } from '../dto/project-response.dto';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly projectsRepository: ProjectsRepository,
    private readonly projectUsersRepository: ProjectUsersRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async create(
    createProjectDto: CreateProjectDto,
    userId: string,
  ): Promise<ProjectResponseDto> {
    // API 키 생성
    const apiKey = this.generateApiKey();

    // 프로젝트 생성
    const project = await this.projectsRepository.create({
      ...createProjectDto,
      apiKey,
    });

    // 프로젝트에 생성자를 관리자로 추가
    await this.projectUsersRepository.create(project.id, userId);

    return new ProjectResponseDto(project);
  }

  async findAll(): Promise<ProjectResponseDto[]> {
    const projects = await this.projectsRepository.findAll();
    return projects.map((project) => new ProjectResponseDto(project));
  }

  async findOne(id: string): Promise<ProjectResponseDto> {
    const project = await this.projectsRepository.findById(id);
    return new ProjectResponseDto(project);
  }

  async findAllByUser(userId: string): Promise<ProjectResponseDto[]> {
    const projectUsers = await this.projectUsersRepository.findByUserId(userId);
    return projectUsers.map((pu) => new ProjectResponseDto(pu.project));
  }

  async findDetailed(id: string): Promise<any> {
    const project = await this.projectsRepository.findWithRelations(id);
    if (!project) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }

    return {
      ...new ProjectResponseDto(project),
      users: project.projectUsers.map((pu) => ({
        id: pu.user.id,
        email: pu.user.email,
        fullName: pu.user.fullName,
        role: pu.user.role,
        addedAt: pu.addedAt,
      })),
      textContentsCount: project.textContents.length,
      imageContentsCount: project.imageContents.length,
      globalSettingsCount: project.globalSettings.length,
      featureTogglesCount: project.featureToggles.length,
    };
  }

  async findByApiKey(apiKey: string): Promise<ProjectResponseDto | null> {
    const project = await this.projectsRepository.findByApiKey(apiKey);
    if (!project) {
      return null;
    }
    return new ProjectResponseDto(project);
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectResponseDto> {
    // 프로젝트 존재 확인
    await this.projectsRepository.findById(id);

    // 업데이트 수행
    const updatedProject = await this.projectsRepository.update(
      id,
      updateProjectDto,
    );

    return new ProjectResponseDto(updatedProject);
  }

  async remove(id: string): Promise<void> {
    await this.projectsRepository.remove(id);
  }

  async addUser(projectId: string, userId: string): Promise<void> {
    // 프로젝트 존재 확인
    await this.projectsRepository.findById(projectId);

    // 사용자 존재 확인
    await this.usersRepository.findById(userId);

    // 이미 프로젝트에 속해 있는지 확인
    const existingRelation = await this.projectUsersRepository.findOne(
      projectId,
      userId,
    );
    if (existingRelation) {
      throw new BadRequestException('User is already added to this project');
    }

    // 사용자를 프로젝트에 추가
    await this.projectUsersRepository.create(projectId, userId);
  }

  async removeUser(projectId: string, userId: string): Promise<void> {
    // 관계 존재 확인
    const relation = await this.projectUsersRepository.findOne(
      projectId,
      userId,
    );
    if (!relation) {
      throw new NotFoundException('User is not in this project');
    }

    // 관계 삭제
    await this.projectUsersRepository.remove(projectId, userId);
  }

  async refreshApiKey(id: string): Promise<{ apiKey: string }> {
    // 프로젝트 존재 확인
    await this.projectsRepository.findById(id);

    // 새 API 키 생성
    const apiKey = this.generateApiKey();

    // 업데이트 수행
    await this.projectsRepository.update(id, { apiKey });

    return { apiKey };
  }

  private generateApiKey(): string {
    // 간단한 고유 API 키 생성 (실제로는 더 복잡한 로직을 사용할 수 있음)
    return randomUUID().replace(/-/g, '');
  }
}
