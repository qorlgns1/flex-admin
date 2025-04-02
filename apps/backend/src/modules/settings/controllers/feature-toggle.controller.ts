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
import { FeatureTogglesService } from '../services/feature-toggle.service';
import { CreateFeatureToggleDto } from '../dto/feature-toggle.dto';
import { UpdateFeatureToggleDto } from '../dto/feature-toggle.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { FeatureToggleResponseDto } from '../dto/feature-toggle.dto';

@Controller('projects/:projectId/toggles')
@UseGuards(JwtAuthGuard)
export class FeatureTogglesController {
  constructor(private readonly featureTogglesService: FeatureTogglesService) {}

  @Post()
  create(
    @Param('projectId') projectId: string,
    @Body() createFeatureToggleDto: CreateFeatureToggleDto,
  ): Promise<FeatureToggleResponseDto> {
    return this.featureTogglesService.create(projectId, createFeatureToggleDto);
  }

  @Get()
  findAll(
    @Param('projectId') projectId: string,
  ): Promise<FeatureToggleResponseDto[]> {
    return this.featureTogglesService.findAll(projectId);
  }

  @Get('key/:key')
  findByKey(
    @Param('projectId') projectId: string,
    @Param('key') key: string,
  ): Promise<FeatureToggleResponseDto> {
    return this.featureTogglesService.findByKey(projectId, key);
  }

  @Get(':id')
  findOne(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
  ): Promise<FeatureToggleResponseDto> {
    return this.featureTogglesService.findOne(projectId, id);
  }

  @Patch(':id')
  update(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Body() updateFeatureToggleDto: UpdateFeatureToggleDto,
  ): Promise<FeatureToggleResponseDto> {
    return this.featureTogglesService.update(
      projectId,
      id,
      updateFeatureToggleDto,
    );
  }

  @Delete(':id')
  remove(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.featureTogglesService.remove(projectId, id);
  }
}
