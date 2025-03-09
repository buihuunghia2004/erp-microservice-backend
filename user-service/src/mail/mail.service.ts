import { AllConfigType } from '@/config/config.type';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    private readonly mailerService: MailerService,
  ) {}

  async sendEmailVerification(email: string, token: string) {
    // Please replace the URL with your own frontend URL
    const url = `http://localhost:3000/api/v1/auth/verify/email?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Email Verification',
      template: 'email-verification',
      context: {
        email: email,
        url,
      },
    });
  }
  async sendEmailResetPassword(email: string, token: string) {
    // Please replace the URL with your own frontend URL
    const url = `http://localhost:5173/reset-password-confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Email Reset Password',
      template: 'email-reset-password',
      context: {
        email: email,
        url,
      },
    });
  }
}
