import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsUUID } from 'class-validator';

export class MailRequestDto {
  @ApiProperty()
  @IsEmail()
  mail_to: string;

  @ApiProperty()
  @IsString()
  partner_name: string;

  @ApiProperty()
  @IsUUID()
  transaction_id: string;

  @ApiProperty()
  @IsString()
  cashback_total: string;
}
