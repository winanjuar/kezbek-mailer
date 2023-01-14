import { Body, Controller, HttpStatus, Logger, Post } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AppService } from './app.service';
import { IMailData } from './core/mail-data.interface';
import { EPatternMessage } from './core/pattern-message.enum';
import { MailRequestDto } from './dto/mail-request.dto';
import { BadRequestResponseDto } from './dto/response/bad-request.response.dto';
import { MailResponseDto } from './dto/response/mail.response.dto';
@ApiTags('Mailer')
@Controller({ version: '1' })
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(private readonly appService: AppService) {}

  @ApiBody({ type: MailRequestDto })
  @ApiCreatedResponse({ type: MailResponseDto })
  @ApiBadRequestResponse({ type: BadRequestResponseDto })
  @Post('try-send-mail')
  public async sendMail(@Body() mailDto: MailRequestDto) {
    const logIdentifier = 'POST try-send-mail';
    await this.appService.sendMail(mailDto);
    this.logger.log(
      `[${logIdentifier}] [${mailDto.transaction_id}] Send mail successfully`,
    );
    return new MailResponseDto(
      HttpStatus.OK,
      'Send mail successfully',
      mailDto,
    );
  }

  @EventPattern(EPatternMessage.SEND_EMAIL)
  async handleSendMail(@Payload() data: IMailData): Promise<void> {
    const logIdentifier = EPatternMessage.SEND_EMAIL;
    await this.appService.sendMail(data);
    this.logger.log(
      `[${logIdentifier}] [${data.transaction_id}] Send mail successfully`,
    );
  }
}
