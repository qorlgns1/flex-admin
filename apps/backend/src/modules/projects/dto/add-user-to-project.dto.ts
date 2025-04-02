import { IsNotEmpty, IsUUID } from 'class-validator';

export class AddUserToProjectDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
