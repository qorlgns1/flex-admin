import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateImageContentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  key: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  @MaxLength(1024)
  imageUrl: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  altText?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateImageContentDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  key?: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  @MaxLength(1024)
  imageUrl?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  altText?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class ImageContentResponseDto {
  id: string;
  projectId: string;
  key: string;
  imageUrl: string;
  altText?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<ImageContentResponseDto>) {
    Object.assign(this, partial);
  }
}
