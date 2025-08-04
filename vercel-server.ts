import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

const expressApp = express();
let nestApp = null;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
  await app.init();
  nestApp = expressApp;
}

bootstrap();

export const handler = (req, res) => {
  if (!nestApp) {
    return res.status(503).send('App not ready');
  }
  return nestApp(req, res);
};
