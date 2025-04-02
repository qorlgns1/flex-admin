import { Exclude, Expose, Type } from 'class-transformer';
import { ProjectUserDto } from './project-user.dto';

@Exclude()
export class ProjectResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  apiKey: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => ProjectUserDto)
  projectUsers?: ProjectUserDto[];

  constructor(partial: Partial<ProjectResponseDto>) {
    Object.assign(this, partial);
  }
}
