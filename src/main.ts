import { AppModule } from '@/app.module';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import cors from 'cors';
import express from 'express';

const server = express();

// ✅ Middleware CORS untuk Vercel serverless
server.use(
  cors({
    origin: ['https://admin-buku-tamu-mkg.vercel.app', 'http://localhost:3000'],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
  }),
);
server.options('*', cors());

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.setGlobalPrefix('api');

  return app.init();
}

export default server;
bootstrap();
