import { prisma } from './prisma';

export async function findAdminByLogin(login: string) {
  return prisma.administrador.findFirst({ where: { Login : login } });
}

