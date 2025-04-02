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
import { TextContentService } from '../services/text-content.service';
import { CreateTextContentDto } from '../dto/text-content.dto';
import { UpdateTextContentDto } from '../dto/text-content.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { TextContentResponseDto } from '../dto/text-content.dto';

@Controller('projects/:projectId/text-content')
@UseGuards(JwtAuthGuard)
export class TextContentController {
  constructor(private readonly textContentService: TextContentService) {}

  @Post()
  create(
    @Param('projectId') projectId: string,
    @Body() createTextContentDto: CreateTextContentDto,
  ): Promise<TextContentResponseDto> {
    return this.textContentService.create(projectId, createTextContentDto);
  }

  @Get()
  findAll(
    @Param('projectId') projectId: string,
  ): Promise<TextContentResponseDto[]> {
    return this.textContentService.findAll(projectId);
  }

  @Get('key/:key')
  findByKey(
    @Param('projectId') projectId: string,
    @Param('key') key: string,
  ): Promise<TextContentResponseDto> {
    return this.textContentService.findByKey(projectId, key);
  }

  @Get(':id')
  findOne(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
  ): Promise<TextContentResponseDto> {
    return this.textContentService.findOne(projectId, id);
  }

  @Patch(':id')
  update(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Body() updateTextContentDto: UpdateTextContentDto,
  ): Promise<TextContentResponseDto> {
    return this.textContentService.update(projectId, id, updateTextContentDto);
  }

  @Delete(':id')
  remove(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.textContentService.remove(projectId, id);
  }
}
