import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../users/enums/user-role.enum';

/**
 * JWT 페이로드 DTO
 * @description JWT 토큰에 포함되는 사용자 정보
 */
export class JwtPayloadDto {
  @ApiProperty({
    description: '사용자 ID',
    example: '1',
  })
  id: string;

  @ApiProperty({
    description: '사용자 이메일',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: '사용자 역할',
    example: UserRole.EDITOR,
    enum: Object.values(UserRole),
  })
  role: UserRole;
}
