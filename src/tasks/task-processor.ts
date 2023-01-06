import { Process, Processor } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { readFile } from 'fs';
import * as nodemailer from 'nodemailer';
import { Logger } from '@nestjs/common';
import { templateSettings, template } from 'lodash';
import { MailOptions } from 'nodemailer/lib/json-transport';

@Processor('EmailSenderQueue')
export class TaskProcessor {
  private readonly logger = new Logger(TaskProcessor.name);
  private readonly mailerService = nodemailer;

  constructor(private configService: ConfigService) {}

  @Process()
  async senderHandler(job) {
    try {
      const { partner_name, transaction_id, cashback_total } = job.data;
      const templatePath = join(
        __dirname,
        '../../src/template/template-mail.html',
      );
      templateSettings.interpolate = /{{([\s\S]+?)}}/g;
      let _content = await this.__readFilePromise(templatePath);
      const compiled = template(_content);
      _content = compiled({ partner_name, transaction_id, cashback_total });

      const transporter = this.mailerService.createTransport({
        host: this.configService.get<string>('SMTP_HOST'),
        port: this.configService.get<number>('SMTP_PORT'),
        logger: true,
        // debug: true,
        secure: false,
        auth: {
          user: this.configService.get<string>('SMTP_USER'),
          pass: this.configService.get<string>('SMTP_PASSWORD'),
        },
      });

      const mailOptions: MailOptions = {
        from: this.configService.get<string>('MAIL_SENDER'),
        to: this.configService.get<string>('MAIL_RECIPIENT'),
        subject: 'Kezbeck Solution',
        html: _content,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          this.logger.log(`${error}`);
        } else {
          this.logger.log(`Email successfully sent: ${info}`);
        }
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  async __readFilePromise(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      readFile(filePath, 'utf8', (err, html) => {
        if (!err) {
          resolve(html);
        } else {
          reject(err);
        }
      });
    });
  }
}
