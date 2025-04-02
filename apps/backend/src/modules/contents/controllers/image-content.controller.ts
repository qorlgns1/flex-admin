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
import { ImageContentService } from '../services/image-content.service';
import { CreateImageContentDto } from '../dto/image-content.dto';
import { UpdateImageContentDto } from '../dto/image-content.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ImageContentResponseDto } from '../dto/image-content.dto';

@Controller('projects/:projectId/image-content')
@UseGuards(JwtAuthGuard)
export class ImageContentController {
  constructor(private readonly imageContentService: ImageContentService) {}

  @Post()
  create(
    @Param('projectId') projectId: string,
    @Body() createImageContentDto: CreateImageContentDto,
  ): Promise<ImageContentResponseDto> {
    return this.imageContentService.create(projectId, createImageContentDto);
  }

  @Get()
  findAll(
    @Param('projectId') projectId: string,
  ): Promise<ImageContentResponseDto[]> {
    return this.imageContentService.findAll(projectId);
  }

  @Get('key/:key')
  findByKey(
    @Param('projectId') projectId: string,
    @Param('key') key: string,
  ): Promise<ImageContentResponseDto> {
    return this.imageContentService.findByKey(projectId, key);
  }

  @Get(':id')
  findOne(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
  ): Promise<ImageContentResponseDto> {
    return this.imageContentService.findOne(projectId, id);
  }

  @Patch(':id')
  update(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Body() updateImageContentDto: UpdateImageContentDto,
  ): Promise<ImageContentResponseDto> {
    return this.imageContentService.update(
      projectId,
      id,
      updateImageContentDto,
    );
  }

  @Delete(':id')
  remove(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.imageContentService.remove(projectId, id);
  }
}
