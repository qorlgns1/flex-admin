import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectUser } from '../entities/project-user.entity';

@Injectable()
export class ProjectUsersRepository {
  constructor(
    @InjectRepository(ProjectUser)
    private readonly projectUsersRepository: Repository<ProjectUser>,
  ) {}

  async findByProjectId(projectId: string): Promise<ProjectUser[]> {
    return this.projectUsersRepository.find({
      where: { projectId },
      relations: ['user'],
    });
  }

  async findByUserId(userId: string): Promise<ProjectUser[]> {
    return this.projectUsersRepository.find({
      where: { userId },
      relations: ['project'],
    });
  }

  async findOne(
    projectId: string,
    userId: string,
  ): Promise<ProjectUser | null> {
    return this.projectUsersRepository.findOne({
      where: { projectId, userId },
      relations: ['project', 'user'],
    });
  }

  async create(projectId: string, userId: string): Promise<ProjectUser> {
    const projectUser = this.projectUsersRepository.create({
      projectId,
      userId,
    });
    return this.projectUsersRepository.save(projectUser);
  }

  async remove(projectId: string, userId: string): Promise<void> {
    await this.projectUsersRepository.delete({ projectId, userId });
  }
}
