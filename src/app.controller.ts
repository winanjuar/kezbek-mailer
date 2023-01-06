import {
  Body,
  Controller,
  InternalServerErrorException,
  Logger,
  Post,
} from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { IMailData } from './core/mail-data.interface';
import { SendEmailDto } from './dto/send-mail.dto';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(private readonly appService: AppService) {}

  @Post()
  public sendEmail(@Body() sendEmailDto: SendEmailDto) {
    this.appService.sendMail(sendEmailDto);
  }

  @EventPattern('ep_send_mail')
  async handleSendEmail(@Payload() data: IMailData): Promise<void> {
    try {
      await this.appService.sendMail(data);
      this.logger.log(
        `[EventPattern ep_send_mail] [${data.transaction_id}] Send email successfully`,
      );
    } catch (error) {
      this.logger.log(`[EventPattern ep_send_mail] ${error}`);
      throw new InternalServerErrorException();
    }
  }
}
