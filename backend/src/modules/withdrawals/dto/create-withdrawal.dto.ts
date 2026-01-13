import { IsIn, IsNumber, Min } from 'class-validator';

export class CreateWithdrawalDto {
  @IsNumber()
  @Min(1)
  amount: number;

  @IsIn(['bank', 'ewallet'])
  method: 'bank' | 'ewallet';
}
