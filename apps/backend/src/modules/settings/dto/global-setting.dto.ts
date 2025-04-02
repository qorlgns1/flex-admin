import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateGlobalSettingDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  key: string;

  @IsString()
  @IsNotEmpty()
  value: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateGlobalSettingDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  key?: string;

  @IsString()
  @IsOptional()
  value?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class GlobalSettingResponseDto {
  id: string;
  projectId: string;
  key: string;
  value: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<GlobalSettingResponseDto>) {
    Object.assign(this, partial);
  }
}
