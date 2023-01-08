import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { IMailData } from './core/mail-data.interface';
import { MailRequestDto } from './dto/mail-request.dto';

@Injectable()
export class AppService {
  constructor(@InjectQueue('EmailSenderQueue') private taskQueue: Queue) {}

  public async sendMail(data: IMailData | MailRequestDto): Promise<void> {
    this.taskQueue.add(data, { backoff: 3 });
  }
}
