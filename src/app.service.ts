import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { IMailData } from './core/mail-data.interface';
import { SendEmailDto } from './dto/send-mail.dto';

@Injectable()
export class AppService {
  constructor(@InjectQueue('EmailSenderQueue') private taskQueue: Queue) {}

  public async sendMail(data: IMailData | SendEmailDto): Promise<void> {
    this.taskQueue.add(data, { backoff: 3 });
  }
}
