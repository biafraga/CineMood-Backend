import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import pinoHttp from 'pino-http';
import swaggerUi from 'swagger-ui-express';
import { openapi } from './config/swagger';
import { errorHandler } from './middlewares/error';
import { publicRouter } from './routes/public';
import { adminRouter } from './routes/admin';
import { env } from './config/env';
import { logger } from './config/logger';

export function buildApp() {
  const app = express();
  app.use(express.json());     // 1. PRIMEIRO (Ler o pacote imediatamente!)
  app.use(cors());             // 2. SEGUNDO (Liberar o acesso)
  app.use(helmet());           // 3. TERCEIRO (Segurança)
  app.use(pinoHttp({ logger })); // 4. QUARTO (Log)


  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi));
  app.get('/docs-json', (_req, res) => res.json(openapi));

  const api = express.Router();
  api.use(publicRouter);
  api.use(adminRouter);

  app.use('/api/v1', api);

  app.use(errorHandler);
  return app;
}

