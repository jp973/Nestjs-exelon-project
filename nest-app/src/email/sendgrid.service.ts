import { Injectable } from '@nestjs/common';
import sgMail from '@sendgrid/mail';

@Injectable()
export class SendGridService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
  }

  async sendEmail(to: string, subject: string, message: string) {
    const msg = {
      to,
      from: process.env.SENDGRID_FROM_EMAIL!,
      subject,
      html: message,
    };

    try {
      const response = await sgMail.send(msg);
      return { success: true, status: response[0].statusCode };
    } catch (error: any) {
      console.error('SendGrid error:', error.response?.body || error);
      throw error;
    }
  }
}
