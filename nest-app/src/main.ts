import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { logger } from './utils/logger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Parse cookies (needed if refresh token is sent in cookie)
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // RabbitMQ microservice connection
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'test_queue',
      queueOptions: { durable: false },
    },
  });

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('User Management API')
    .setDescription('API for managing users with CRUD operations')
    .setVersion('1.0')
    .addTag('users')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter Access Token (without Bearer prefix)',
        in: 'header',
      },
      'JWT-auth',
    )
   
    .addServer('http://localhost:4000', 'Local development server')
    .setContact('Support', 'http://example.com/support', 'support@example.com')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'User Management API',
    customJs: `
      window.onload = function() {
        const authInputs = document.querySelectorAll('input[placeholder*="Enter Access Token"]');
        authInputs.forEach(input => {
          input.placeholder = "Paste access token here (no 'Bearer' needed)";
        });
      }
    `,
  });

  const port = process.env.PORT ?? 4000;

  // Start both HTTP app and RabbitMQ microservice
 // await app.startAllMicroservices();
  await app.listen(port);

  logger.info(`Application is running on: http://localhost:${port}`);
  logger.info(`Swagger documentation available at: http://localhost:${port}/api`);
}

bootstrap();
