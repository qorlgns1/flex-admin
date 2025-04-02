import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTextContentDto {
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

export class UpdateTextContentDto {
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

export class TextContentResponseDto {
  id: string;
  projectId: string;
  key: string;
  value: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<TextContentResponseDto>) {
    Object.assign(this, partial);
  }
}
