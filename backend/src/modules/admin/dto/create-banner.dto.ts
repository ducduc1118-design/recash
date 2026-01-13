import { IsBoolean, IsInt, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateBannerDto {
  @IsString()
  title: string;

  @IsString()
  subtitle: string;

  @IsString()
  imageUrl: string;

  @IsString()
  ctaText: string;

  @IsString()
  ctaUrl: string;

  @IsString()
  bgClass: string;

  @IsString()
  textClass: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsInt()
  priority?: number;

  @IsOptional()
  startsAt?: string;

  @IsOptional()
  endsAt?: string;
}
