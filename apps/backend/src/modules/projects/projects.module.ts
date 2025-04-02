import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsService } from './services/project.service';
import { ProjectsController } from './controllers/project.controller';
import { ProjectsRepository } from './repositories/project.repository';
import { Project } from './entities/project.entity';
import { UsersModule } from '../users/users.module';
import { ProjectUser } from '../users/entities/project-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, ProjectUser]), UsersModule],
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectsRepository],
  exports: [ProjectsService, ProjectsRepository],
})
export class ProjectsModule {}
