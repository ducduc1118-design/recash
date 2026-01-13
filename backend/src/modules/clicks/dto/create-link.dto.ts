import { IsString, IsUrl } from 'class-validator';

export class CreateLinkDto {
  @IsString()
  @IsUrl({ require_tld: false })
  url: string;
}
