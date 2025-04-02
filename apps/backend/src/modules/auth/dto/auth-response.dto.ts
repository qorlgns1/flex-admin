import { Exclude, Expose, Type } from 'class-transformer';
import { UserResponseDto } from '../../users/dto/user-response.dto';

@Exclude()
export class AuthResponseDto {
  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto;

  @Expose()
  accessToken: string;

  constructor(partial: Partial<AuthResponseDto>) {
    Object.assign(this, partial);
  }
}
