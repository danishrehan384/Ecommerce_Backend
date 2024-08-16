import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { JwtGuard } from './Auth/Guards/jwt.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });
  app.setGlobalPrefix('api/v1');
  const PORT = process.env.PORT || 3000;
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalGuards(new JwtGuard());

  const config = new DocumentBuilder()
    .setTitle('Ecommerce Backend')
    .setDescription('Ecommerce Nest App Rest Api Docs')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT Token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);

  await app.listen(3000, () => {
    console.log(
      `Api is running on port ${PORT} and MODE IS: ${process.env.NODE_ENV}`,
    );
  });
}
bootstrap();
