import { IsEmail, IsOptional, IsString } from 'class-validator';
import { Role } from '@prisma/client';

export class UpsertUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsOptional()
  role?: Role;
}
