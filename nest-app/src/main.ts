import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

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
        description: 'Enter JWT token (without Bearer prefix)',
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
      requestInterceptor: (req) => {
        if (req.headers?.Authorization && !req.headers.Authorization.startsWith('Bearer ')) {
          req.headers.Authorization = `Bearer ${req.headers.Authorization}`;
        }
        return req;
      },
      authAction: {
        'JWT-auth': {
          name: 'JWT-auth',
          schema: {
            type: 'apiKey',
            in: 'header',
            name: 'Authorization',
            description: 'Enter JWT token (without Bearer prefix)',
          },
        },
      },
    },
    customSiteTitle: 'User Management API',
    customJs: `
      window.onload = function() {
        // Update placeholder text
        const authInputs = document.querySelectorAll('input[placeholder*="Enter JWT token"]');
        authInputs.forEach(input => {
          input.placeholder = "Paste token here (no 'Bearer' needed)";
        });
        
        // Auto-add Bearer prefix when authorizing
        document.addEventListener('click', function(e) {
          if (e.target.classList.contains('btn') {
            const authBtn = e.target.closest('.auth-btn');
            if (authBtn) {
              const input = authBtn.querySelector('input');
              if (input && input.value && !input.value.startsWith('Bearer ')) {
                input.value = 'Bearer ' + input.value;
              }
            }
          }
        });
      }
    `,
  });

  const port = process.env.PORT ?? 4000;
  await app.listen(port);
  
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation available at: http://localhost:${port}/api`);
}

bootstrap();