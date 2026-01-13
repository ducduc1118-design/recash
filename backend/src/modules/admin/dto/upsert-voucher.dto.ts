import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpsertVoucherDto {
  @IsString()
  storeId: string;

  @IsString()
  title: string;

  @IsString()
  code: string;

  @IsString()
  expiry: string;

  @IsString()
  type: 'percent' | 'fixed' | 'shipping';

  @IsString()
  category: 'Fashion' | 'Tech' | 'Food' | 'Travel';

  @IsOptional()
  @IsBoolean()
  isHot?: boolean;
}
