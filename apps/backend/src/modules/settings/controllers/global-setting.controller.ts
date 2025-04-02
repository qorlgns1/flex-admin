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
import { GlobalSettingsService } from '../services/global-setting.service';
import { CreateGlobalSettingDto } from '../dto/global-setting.dto';
import { UpdateGlobalSettingDto } from '../dto/global-setting.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GlobalSettingResponseDto } from '../dto/global-setting.dto';

@Controller('projects/:projectId/settings')
@UseGuards(JwtAuthGuard)
export class GlobalSettingsController {
  constructor(private readonly globalSettingsService: GlobalSettingsService) {}

  @Post()
  create(
    @Param('projectId') projectId: string,
    @Body() createGlobalSettingDto: CreateGlobalSettingDto,
  ): Promise<GlobalSettingResponseDto> {
    return this.globalSettingsService.create(projectId, createGlobalSettingDto);
  }

  @Get()
  findAll(
    @Param('projectId') projectId: string,
  ): Promise<GlobalSettingResponseDto[]> {
    return this.globalSettingsService.findAll(projectId);
  }

  @Get('key/:key')
  findByKey(
    @Param('projectId') projectId: string,
    @Param('key') key: string,
  ): Promise<GlobalSettingResponseDto> {
    return this.globalSettingsService.findByKey(projectId, key);
  }

  @Get(':id')
  findOne(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
  ): Promise<GlobalSettingResponseDto> {
    return this.globalSettingsService.findOne(projectId, id);
  }

  @Patch(':id')
  update(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Body() updateGlobalSettingDto: UpdateGlobalSettingDto,
  ): Promise<GlobalSettingResponseDto> {
    return this.globalSettingsService.update(
      projectId,
      id,
      updateGlobalSettingDto,
    );
  }

  @Delete(':id')
  remove(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.globalSettingsService.remove(projectId, id);
  }
}
