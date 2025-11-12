import { AppModule } from '@/app.module';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

const server = express();

async function bootstrap() {
  // 🔹 Gunakan ExpressAdapter agar kompatibel dengan Vercel
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  // Security & rate limit
  app.use(helmet());
  app.use(
    rateLimit({
      windowMs: 60 * 1000, // 1 menit
      max: 100, // max 100 request per IP
    }),
  );

  // Prefix semua route
  app.setGlobalPrefix('api');

  // ✅ Aktifkan CORS langsung di NestJS
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:3000',
        'https://admin-buku-tamu-mkg.vercel.app',
      ];

      // Izinkan tools tanpa origin (Postman, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`❌ Blocked by CORS: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'access_token',
      'user_id',
    ],
  });

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Buku Tamu MKG')
    .setDescription('Buku Tamu MKG API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // ⚠️ Jangan panggil app.listen() di Vercel
  await app.init();
}

bootstrap();

export default server;
