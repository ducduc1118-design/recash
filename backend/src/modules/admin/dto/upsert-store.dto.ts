import { IsNumber, IsString } from 'class-validator';

export class UpsertStoreDto {
  @IsString()
  name: string;

  @IsString()
  initials: string;

  @IsString()
  color: string;

  @IsNumber()
  cashbackUpTo: number;
}
