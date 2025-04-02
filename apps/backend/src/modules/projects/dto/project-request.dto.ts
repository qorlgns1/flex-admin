import { Request } from 'express';
import { ProjectResponseDto } from './project-response.dto';

export interface ProjectRequestDto extends Request {
  project: ProjectResponseDto;
}
