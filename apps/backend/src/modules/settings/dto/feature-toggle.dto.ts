import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateFeatureToggleDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  key: string;

  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateFeatureToggleDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  key?: string;

  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean;

  @IsString()
  @IsOptional()
  description?: string;
}

export class FeatureToggleResponseDto {
  id: string;
  projectId: string;
  key: string;
  isEnabled: boolean;
  description?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<FeatureToggleResponseDto>) {
    Object.assign(this, partial);
  }
}
