import { AppModule } from '@/app.module';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security & performance setup
  const server = app.getHttpAdapter().getInstance();
  server.set('trust proxy', 1);
  app.use(helmet());
  app.use(
    rateLimit({
      windowMs: 60 * 1000, // 1 menit
      max: 100, // max 100 request per menit
    }),
  );

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Buku Tamu MKG')
    .setDescription('Buku Tamu MKG')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
