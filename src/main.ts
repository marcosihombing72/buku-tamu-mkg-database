import { AppModule } from '@/app.module';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

const server = express();

// ✅ Middleware security & rate limit global
server.set('trust proxy', 1);
server.use(helmet());
server.use(
  rateLimit({
    windowMs: 60 * 1000, // 1 menit
    max: 100, // max 100 request per IP
  }),
);

async function bootstrap() {
  // Gunakan ExpressAdapter untuk serverless Vercel
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  // ✅ Prefix semua route
  app.setGlobalPrefix('api');

  // ✅ Enable CORS
  app.enableCors({
    origin: [
      'http://localhost:3000', // development
      'https://admin-buku-tamu-mkg.vercel.app', // production
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true, // jika ada cookie / JWT
  });

  // ✅ Swagger
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

  // ❌ Jangan pakai app.listen() di Vercel
  await app.init();
}

bootstrap();

export default server;
