import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Post,
} from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AppService } from './app.service';
import { IMailData } from './core/mail-data.interface';
import { MailRequestDto } from './dto/mail-request.dto';
import { BadRequestResponseDto } from './dto/response/bad-request.response.dto';
import { InternalServerErrorResponseDto } from './dto/response/internal-server-error.response.dto';
import { MailResponseDto } from './dto/response/mail.response.dto';
@ApiTags('Mailer')
@Controller({ version: '1' })
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(private readonly appService: AppService) {}

  @ApiBody({ type: MailRequestDto })
  @ApiOkResponse({ type: MailResponseDto })
  @ApiBadRequestResponse({ type: BadRequestResponseDto })
  @ApiInternalServerErrorResponse({ type: InternalServerErrorResponseDto })
  @HttpCode(200)
  @Post()
  public async sendMail(@Body() mailDto: MailRequestDto) {
    await this.appService.sendMail(mailDto);
    return new MailResponseDto(
      HttpStatus.OK,
      'Send mail successfully',
      mailDto,
    );
  }

  @EventPattern('ep_send_mail')
  async handleSendMail(@Payload() data: IMailData): Promise<void> {
    try {
      await this.appService.sendMail(data);
      this.logger.log(
        `[EventPattern ep_send_mail] [${data.transaction_id}] Send mail successfully`,
      );
    } catch (error) {
      this.logger.log(`[EventPattern ep_send_mail] ${error}`);
      throw new InternalServerErrorException();
    }
  }
}
