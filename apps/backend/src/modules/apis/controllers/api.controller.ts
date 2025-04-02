import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { ApiService } from '../services/api.service';
import { ApiKeyGuard } from '../../auth/guards/api-key.guard';
import { ApiHeader, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';

@ApiTags('api')
@Controller('api')
@UseGuards(ApiKeyGuard)
@ApiHeader({
  name: 'x-api-key',
  description: '프로젝트 API 키',
  required: true,
})
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Get('text')
  @ApiOperation({
    summary: '텍스트 콘텐츠 조회',
    description: '프로젝트의 텍스트 콘텐츠를 조회합니다.',
  })
  @ApiQuery({ name: 'key', required: false, description: '특정 콘텐츠 키' })
  getTextContent(
    @Request() req: ExpressRequest & { project: { id: string } },
    @Query('key') key?: string,
  ): Promise<Record<string, string | null>> {
    const projectId = req.project.id;
    return this.apiService.getTextContent(projectId, key);
  }

  @Get('images')
  @ApiOperation({
    summary: '이미지 콘텐츠 조회',
    description: '프로젝트의 이미지 콘텐츠를 조회합니다.',
  })
  @ApiQuery({ name: 'key', required: false, description: '특정 콘텐츠 키' })
  getImageContent(
    @Request() req: ExpressRequest & { project: { id: string } },
    @Query('key') key?: string,
  ): Promise<Record<string, { url: string; alt?: string } | null>> {
    const projectId = req.project.id;
    return this.apiService.getImageContent(projectId, key);
  }

  @Get('settings')
  @ApiOperation({
    summary: '전역 설정 조회',
    description: '프로젝트의 전역 설정을 조회합니다.',
  })
  @ApiQuery({ name: 'key', required: false, description: '특정 설정 키' })
  getGlobalSettings(
    @Request() req: ExpressRequest & { project: { id: string } },
    @Query('key') key?: string,
  ): Promise<Record<string, string | null>> {
    const projectId = req.project.id;
    return this.apiService.getGlobalSettings(projectId, key);
  }

  @Get('toggles')
  @ApiOperation({
    summary: '기능 토글 조회',
    description: '프로젝트의 기능 토글 상태를 조회합니다.',
  })
  @ApiQuery({ name: 'key', required: false, description: '특정 토글 키' })
  getFeatureToggles(
    @Request() req: ExpressRequest & { project: { id: string } },
    @Query('key') key?: string,
  ): Promise<Record<string, boolean>> {
    const projectId = req.project.id;
    return this.apiService.getFeatureToggles(projectId, key);
  }

  @Get('all')
  @ApiOperation({
    summary: '모든 콘텐츠 조회',
    description: '프로젝트의 모든 콘텐츠와 설정을 한 번에 조회합니다.',
  })
  getAllContent(
    @Request() req: ExpressRequest & { project: { id: string } },
  ): Promise<{
    textContent: Record<string, string>;
    imageContent: Record<string, { url: string; alt?: string }>;
    settings: Record<string, string>;
    toggles: Record<string, boolean>;
  }> {
    const projectId = req.project.id;
    return this.apiService.getAllContent(projectId);
  }
}
