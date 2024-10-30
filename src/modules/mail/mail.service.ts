import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { SendMailProps } from './interfaces';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail({ to, subject, template, context }: SendMailProps) {
    return await this.mailerService.sendMail({
      to: to,
      subject: subject,
      template: template,
      context,
    });
  }
}
