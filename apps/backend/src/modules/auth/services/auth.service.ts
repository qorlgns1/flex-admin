import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../../users/services/user.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { UserResponseDto } from '../../users/dto/user-response.dto';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { UserRole } from '../../users/enums/user-role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    // 사용자 검색
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 비활성 사용자 확인
    if (!user.isActive) {
      throw new UnauthorizedException('User is inactive');
    }

    // 토큰 생성
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return new AuthResponseDto({
      user: new UserResponseDto(user),
      accessToken,
    });
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, password, fullName } = registerDto;

    // 이메일 중복 확인
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    // 첫 번째 사용자는 ADMIN 역할 부여, 나머지는 EDITOR 역할
    const userCount = await this.getUserCount();
    const role = userCount === 0 ? UserRole.ADMIN : UserRole.EDITOR;

    // 사용자 생성
    const createUserDto: CreateUserDto = {
      email,
      password,
      fullName,
      role,
    };

    const newUser = await this.usersService.create(createUserDto);

    // 토큰 생성
    const payload = {
      sub: newUser.id,
      email: newUser.email,
      role: newUser.role,
    };
    const accessToken = this.jwtService.sign(payload);

    return new AuthResponseDto({
      user: newUser,
      accessToken,
    });
  }

  async validateUser(userId: string, email: string) {
    const user = await this.usersService.findOne(userId);
    if (user && user.email === email) {
      return user;
    }
    return null;
  }

  private async getUserCount(): Promise<number> {
    const users = await this.usersService.findAll();
    return users.length;
  }
}
