import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateHomeSectionDto {
  @IsOptional()
  @IsString()
  key?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsInt()
  priority?: number;

  @IsOptional()
  config?: unknown;
}
