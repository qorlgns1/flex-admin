import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

/**
 * 인증 컨트롤러
 * @description 사용자 인증 관련 API를 제공합니다.
 */
@ApiTags('인증')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 로그인
   * @description 사용자 로그인을 처리합니다.
   */
  @ApiOperation({
    summary: '로그인',
    description: '이메일과 비밀번호로 로그인합니다.',
  })
  @ApiBody({
    type: LoginDto,
    description: '로그인 정보',
    examples: {
      example1: {
        summary: '일반 로그인',
        value: {
          email: 'user@example.com',
          password: 'password123',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '로그인 성공',
    type: AuthResponseDto,
    examples: {
      example1: {
        summary: '로그인 성공 응답',
        value: {
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          user: {
            id: 1,
            email: 'user@example.com',
            role: 'USER',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패',
    examples: {
      example1: {
        summary: '인증 실패 응답',
        value: {
          statusCode: 401,
          message: '이메일 또는 비밀번호가 올바르지 않습니다.',
        },
      },
    },
  })
  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  /**
   * 회원가입
   * @description 새로운 사용자 등록을 처리합니다.
   */
  @ApiOperation({
    summary: '회원가입',
    description: '새로운 사용자를 등록합니다.',
  })
  @ApiBody({
    type: RegisterDto,
    description: '회원가입 정보',
    examples: {
      example1: {
        summary: '일반 회원가입',
        value: {
          email: 'newuser@example.com',
          password: 'password123',
          name: '홍길동',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: '회원가입 성공',
    type: AuthResponseDto,
    examples: {
      example1: {
        summary: '회원가입 성공 응답',
        value: {
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          user: {
            id: 2,
            email: 'newuser@example.com',
            name: '홍길동',
            role: 'USER',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청',
    examples: {
      example1: {
        summary: '이메일 중복',
        value: {
          statusCode: 400,
          message: '이미 사용 중인 이메일입니다.',
        },
      },
    },
  })
  @Post('register')
  register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  /**
   * 프로필 조회
   * @description 현재 로그인한 사용자의 프로필 정보를 조회합니다.
   */
  @ApiOperation({
    summary: '프로필 조회',
    description: '현재 로그인한 사용자의 정보를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '프로필 조회 성공',
    type: JwtPayloadDto,
  })
  @ApiResponse({
    status: 401,
    description: '인증되지 않은 요청',
    examples: {
      example1: {
        summary: '인증 실패 응답',
        value: {
          statusCode: 401,
          message: '인증되지 않은 요청입니다.',
        },
      },
    },
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: Request & { user: JwtPayloadDto }): JwtPayloadDto {
    return req.user;
  }
}
