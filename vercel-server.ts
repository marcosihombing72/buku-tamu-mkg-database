import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { AppModule } from './src/app.module';

const server = express();

export const handler = async (req, res) => {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  await app.init();
  server(req, res);
};
