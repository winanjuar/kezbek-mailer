import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SendEmailDto {
  @ApiProperty()
  @IsString()
  mail_to: string;

  @ApiProperty()
  @IsString()
  partner_name: string;

  @ApiProperty()
  @IsString()
  transaction_id: string;

  @ApiProperty()
  @IsString()
  cashback_total: string;
}
