import { AppModule } from '@/app.module';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import express, { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

const server = express();

// ✅ Tambahkan CORS manual di level Express
server.use((req: Request, res: Response, next: NextFunction) => {
  const allowedOrigins = [
    'http://localhost:3000',
    'https://admin-buku-tamu-mkg.vercel.app',
  ];

  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header(
    'Access-Control-Allow-Methods',
    'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, access_token, user_id',
  );
  res.header('Access-Control-Allow-Credentials', 'true');

  // ✅ Jika preflight request, kirim 200 langsung
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

// ✅ Middleware keamanan
server.set('trust proxy', 1);
server.use(helmet());
server.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 100,
  }),
);

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.setGlobalPrefix('api');

  // ✅ Tetap aktifkan CORS di sisi NestJS
  app.enableCors({
    origin: ['http://localhost:3000', 'https://admin-buku-tamu-mkg.vercel.app'],
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
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Buku Tamu MKG')
    .setDescription('Buku Tamu MKG API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.init();
}

bootstrap();

export default server;
