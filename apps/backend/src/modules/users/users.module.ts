import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './services/user.service';
import { UsersController } from './controllers/user.controller';
import { UsersRepository } from './repositories/user.repository';
import { ProjectUsersRepository } from './repositories/project-user.repository';
import { ProjectUser } from './entities/project-user.entity';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, ProjectUser])],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, ProjectUsersRepository],
  exports: [UsersService, UsersRepository, ProjectUsersRepository],
})
export class UsersModule {}
