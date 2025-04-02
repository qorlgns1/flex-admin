// api-key.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ProjectsService } from '../../projects/services/project.service';
import { ProjectRequestDto } from '../../projects/dto/project-request.dto';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly projectsService: ProjectsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<ProjectRequestDto>();
    const apiKey = request.headers['x-api-key'];

    if (!apiKey) {
      throw new UnauthorizedException('API key is missing');
    }

    const project = await this.projectsService.findByApiKey(apiKey as string);
    if (!project) {
      throw new UnauthorizedException('Invalid API key');
    }

    // 요청에 프로젝트 정보 추가
    request.project = project;
    return true;
  }
}
