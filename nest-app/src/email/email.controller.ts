import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { SendEmailDto } from '../dto/send-mail-dto';
import { SendGridService } from './sendgrid.service';

@ApiTags('Email')
@Controller('email')
export class EmailController {
  constructor(private readonly sendGridService: SendGridService) {}

  @Post('send')
  @ApiBody({
    type: SendEmailDto,
    examples: {
      default: {
        value: {
          to: 'recipient@example.com',
          subject: 'Test Email from NestJS + SendGrid',
          message: '<h1>Hello!</h1><p>This is a test email sent using SendGrid and NestJS.</p>',
        },
      },
    },
  })
  async sendEmail(@Body() sendEmailDto: SendEmailDto) {
    const { to, subject, message } = sendEmailDto;
    return await this.sendGridService.sendEmail(to, subject, message);
  }
}
