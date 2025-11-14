import { NextFunction, Request, Response } from 'express';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const status = err.statusCode || err.status || 500;
  const message = err.message || 'Erro interno do servidor';
  res.status(status).json({ error: 'Erro', message });
}

