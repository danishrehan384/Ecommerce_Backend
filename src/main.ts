import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 3000
  await app.listen(3000, ()=>{
    console.log(`Api is running on port ${PORT} and MODE IS: ${process.env.NODE_ENV}`)
  });
}
bootstrap();
