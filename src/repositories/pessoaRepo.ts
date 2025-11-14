import { prisma } from './prisma';

const notDeleted = { deletadoEm: null as any };

export function listPessoas(params: { nome?: string; page?: number; limit?: number }) {
  const { nome, page = 1, limit = 20 } = params;
  return prisma.pessoa.findMany({
    where: {
      ...(nome ? { nome: { contains: nome } } : {}),
      ...(notDeleted.deletadoEm !== undefined ? { deletadoEm: null } : {}),
    },
    orderBy: { id: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
  });
}

export function createPessoa(data: { nome: string; biografia?: string; FotoUrl?: string }) {
  return prisma.pessoa.create({ data });
}

export function updatePessoa(id: number, data: Partial<{ nome: string; biografia?: string; FotoUrl?: string }>) {
  return prisma.pessoa.update({ where: { id }, data });
}

export function softDeletePessoa(id: number) {
  return prisma.pessoa.update({ where: { id }, data: { deletadoEm: new Date() } as any });
}

export function pessoasPorFilme(idFilme: number) {
  return prisma.filme_pessoa.findMany({ where: { IDFilme: idFilme }, include: { pessoa: true } });
}

