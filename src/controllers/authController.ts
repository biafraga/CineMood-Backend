import { Request, Response } from 'express';
import { loginSchema } from '../schemas';
import { loginAdmin } from '../services/authService';

export async function adminLogin(req: Request, res: Response) {
  const body = loginSchema.parse(req.body);
  const result = await loginAdmin(body.login, body.senha);
  if (!result) return res.status(401).json({ error: 'Credenciais inválidas', message: 'Login ou senha incorretos' });
  res.json(result);
}

