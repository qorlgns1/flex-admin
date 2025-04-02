import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from '../services/project.service';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AddUserToProjectDto } from '../dto/add-user-to-project.dto';
import { ProjectResponseDto } from '../dto/project-response.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { CurrentUser } from '../../users/decorators/current-user.decorator';

@Controller('projects')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(
    @Body() createProjectDto: CreateProjectDto,
    @CurrentUser() user: User,
  ): Promise<ProjectResponseDto> {
    return this.projectsService.create(createProjectDto, user.id);
  }

  @Get()
  findAll(): Promise<ProjectResponseDto[]> {
    return this.projectsService.findAll();
  }

  @Get('my')
  findMyProjects(@CurrentUser() user: User): Promise<ProjectResponseDto[]> {
    return this.projectsService.findAllByUser(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ProjectResponseDto> {
    return this.projectsService.findOne(id);
  }

  @Get(':id/detailed')
  findDetailed(@Param('id') id: string): Promise<any> {
    return this.projectsService.findDetailed(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectResponseDto> {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.projectsService.remove(id);
  }

  @Post(':id/users')
  addUser(
    @Param('id') id: string,
    @Body() addUserToProjectDto: AddUserToProjectDto,
  ): Promise<void> {
    return this.projectsService.addUser(id, addUserToProjectDto.userId);
  }

  @Delete(':id/users/:userId')
  removeUser(
    @Param('id') id: string,
    @Param('userId') userId: string,
  ): Promise<void> {
    return this.projectsService.removeUser(id, userId);
  }

  @Post(':id/refresh-api-key')
  refreshApiKey(@Param('id') id: string): Promise<{ apiKey: string }> {
    return this.projectsService.refreshApiKey(id);
  }
}
