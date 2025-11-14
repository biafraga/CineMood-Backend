import { buildApp } from './app';
import { env } from './config/env';

const app = buildApp();
app.listen(env.port, () => {
  console.log(`CineMood API rodando na porta ${env.port}`);
});

