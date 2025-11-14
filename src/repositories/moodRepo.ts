import { prisma } from './prisma';

export function listMoods() {
  return prisma.mood.findMany({ orderBy: { nome: 'asc' } });
}

