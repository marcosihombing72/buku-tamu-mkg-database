// src/main.ts
import { AppModule } from '@/app.module';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

const server = express();

// ✅ Middleware CORS global (untuk preflight di serverless Vercel)
const allowedOrigins = [
  'http://localhost:3000',
  'https://admin-buku-tamu-mkg.vercel.app',
];

server.use(
  cors({
    origin: (origin, callback) => {
      // origin = undefined untuk tools seperti Postman
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
  }),
);

// Tangani preflight OPTIONS
server.options('*', cors({ origin: allowedOrigins, credentials: true }));

async function bootstrap() {
  // Gunakan ExpressAdapter untuk serverless
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  // Security & rate limiting
  server.set('trust proxy', 1); // jika deploy di Vercel
  app.use(helmet());
  app.use(
    rateLimit({
      windowMs: 60 * 1000, // 1 menit
      max: 100, // max 100 request / menit per IP
    }),
  );

  // Prefix semua route
  app.setGlobalPrefix('api');

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

  // ❌ Jangan pakai app.listen() di Vercel
  await app.init();
}

bootstrap();

export default server;
