import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../services/auth.service';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';

/**
 * JWT 인증 전략
 * @description JWT 토큰을 검증하고 사용자 정보를 반환하는 전략
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  /**
   * JWT 페이로드를 검증하고 사용자 정보를 반환합니다.
   * @param payload - JWT 페이로드
   * @returns 검증된 사용자 정보
   * @throws UnauthorizedException - 사용자가 유효하지 않은 경우
   */
  async validate(payload: JwtPayloadDto): Promise<JwtPayloadDto> {
    const user = await this.authService.validateUser(payload.id, payload.email);
    if (!user) {
      throw new UnauthorizedException('유효하지 않은 사용자입니다.');
    }
    return {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };
  }
}
