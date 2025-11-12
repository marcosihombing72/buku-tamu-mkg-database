import { AppModule } from '@/app.module';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security & performance
  app.use(helmet());
  app.use(
    rateLimit({
      windowMs: 60 * 1000, // 1 menit
      max: 100, // max 100 request / menit
    }),
  );

  // Prefix semua route
  app.setGlobalPrefix('api');

  // ✅ Enable CORS untuk frontend tertentu
  app.enableCors({
    origin: [
      'https://admin-buku-tamu-mkg.vercel.app', // production
      'http://localhost:3000', // development
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true, // untuk JWT / cookie auth
  });

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Buku Tamu MKG')
    .setDescription('Buku Tamu MKG API')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Start server
  await app.listen(process.env.PORT || 3000);
}

bootstrap();
