import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TextContentService } from './services/text-content.service';
import { ImageContentService } from './services/image-content.service';
import { TextContentController } from './controllers/text-content.controller';
import { ImageContentController } from './controllers/image-content.controller';
import { TextContentRepository } from './repositories/text-content.repository';
import { ImageContentRepository } from './repositories/image-content.repository';
import { TextContent } from './entities/text-content.entity';
import { ImageContent } from './entities/image-content.entity';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TextContent, ImageContent]),
    ProjectsModule,
  ],
  controllers: [TextContentController, ImageContentController],
  providers: [
    TextContentService,
    ImageContentService,
    TextContentRepository,
    ImageContentRepository,
  ],
  exports: [TextContentService, ImageContentService],
})
export class ContentModule {}
