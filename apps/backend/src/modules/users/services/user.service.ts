import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from '../repositories/user.repository';
import { ProjectUsersRepository } from '../repositories/project-user.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { UserResponseDto } from '../dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly projectUsersRepository: ProjectUsersRepository,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const { email, password, ...rest } = createUserDto;

    // 이메일 중복 확인
    const existingUser = await this.usersRepository.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    // 비밀번호 해싱
    const hashedPassword = await this.hashPassword(password);

    // 사용자 생성
    const user = await this.usersRepository.create({
      email,
      hashedPassword,
      ...rest,
    });

    return new UserResponseDto(user);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersRepository.findAll();
    return users.map((user) => new UserResponseDto(user));
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.usersRepository.findById(id);
    return new UserResponseDto(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    // 사용자 존재 확인
    await this.usersRepository.findById(id);

    const { password, ...rest } = updateUserDto;
    let hashedPassword: string | undefined;

    // 비밀번호 변경이 있는 경우
    if (password) {
      hashedPassword = await this.hashPassword(password);
    }

    // 업데이트 수행
    const updatedUser = await this.usersRepository.update(id, {
      ...(hashedPassword && { hashedPassword }),
      ...rest,
    });

    return new UserResponseDto(updatedUser);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.remove(id);
  }

  async getUserProjects(userId: string): Promise<any[]> {
    const projectUsers = await this.projectUsersRepository.findByUserId(userId);
    return projectUsers.map((pu) => ({
      id: pu.project.id,
      name: pu.project.name,
      description: pu.project.description,
      addedAt: pu.addedAt,
    }));
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }
}
