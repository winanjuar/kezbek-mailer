import { ApiProperty } from '@nestjs/swagger';
import { MailRequestDto } from '../mail-request.dto';
import { BaseResponseDto } from './base.response.dto';

export class MailResponseDto extends BaseResponseDto {
  constructor(statusCode: number, message: string, data: MailRequestDto) {
    super(statusCode, message);
    this.data = data;
  }

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'This is string' })
  message: string;

  @ApiProperty({ type: MailRequestDto })
  data: MailRequestDto;
}
