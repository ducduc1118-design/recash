import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateHomeSectionDto {
  @IsString()
  key: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsInt()
  priority?: number;

  config: unknown;
}
