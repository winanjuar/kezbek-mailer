import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from './base.response.dto';

export class BadRequestResponseDto extends BaseResponseDto {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({
    example: ['Field name must number'],
  })
  message: string[];

  @ApiProperty({ example: 'Bad Request' })
  error: string;
}
