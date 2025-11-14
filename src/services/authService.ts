import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { findAdminByLogin } from '../repositories/adminRepo';

export async function loginAdmin(login: string, senha: string) {
  const admin = await findAdminByLogin(login);
  if (!admin) return null;
  const ok = await bcrypt.compare(senha, admin.senhaHash);
  if (!ok) return null;
  const token = jwt.sign({ sub: admin.id, login: admin.login }, env.jwtSecret, { expiresIn: '24h' });
  return { token, expiraEm: '24h' };
}

