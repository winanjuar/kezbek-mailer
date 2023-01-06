import { IsString } from 'class-validator';

export class SendEmailDto {
  @IsString()
  mail_to: string;

  @IsString()
  partner_name: string;

  @IsString()
  transaction_id: string;

  @IsString()
  cashback_total: string;
}
