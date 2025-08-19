
// nest-app/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe for class-validator
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remove non-whitelisted properties
    forbidNonWhitelisted: true, // Throw errors for non-whitelisted properties
    transform: true, // Automatically transform payloads to DTO instances
  }));

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
        name: 'JWT',
        description: 'Enter JWT token',
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
      persistAuthorization: true, // This will persist the authorization token
    },
  });

  const port = process.env.PORT ?? 4000;
  await app.listen(port);
  
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation available at: http://localhost:${port}/api`);
}

bootstrap();