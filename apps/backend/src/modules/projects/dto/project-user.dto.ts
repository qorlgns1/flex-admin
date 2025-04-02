import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from '../../users/dto/user-response.dto';

export class ProjectUserDto {
  @Expose()
  addedAt: Date;

  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto;
}
