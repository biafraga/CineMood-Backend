import { prisma } from './prisma';

const notDeleted = { deletadoEm: null as any };

export function listFilmes(params: { titulo?: string; anoLancamento?: number; page?: number; limit?: number }) {
  const { titulo, anoLancamento, page = 1, limit = 20 } = params;
  return prisma.filme.findMany({
    where: {
      ...(titulo ? { titulo: { contains: titulo } } : {}),
      ...(anoLancamento ? { AnoLancamento: anoLancamento } : {}),
      ...(notDeleted.deletadoEm !== undefined ? { deletadoEm: null } : {}),
    },
    orderBy: { id: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
  });
}

export function getFilme(id: number) {
  return prisma.filme.findFirst({
    where: { id, ...(notDeleted.deletadoEm !== undefined ? { deletadoEm: null } : {}) },
  });
}

export function createFilme(data: { titulo: string; sinopse?: string; AnoLancamento: number; PosterUrl?: string; FraseEfeito?: string }) {
  return prisma.filme.create({ data });
}

export function updateFilme(id: number, data: Partial<{ titulo: string; sinopse?: string; AnoLancamento: number; PosterUrl?: string; FraseEfeito?: string }>) {
  return prisma.filme.update({ where: { id }, data });
}

export function softDeleteFilme(id: number) {
  return prisma.filme.update({ where: { id }, data: { deletadoEm: new Date() } as any });
}

export function filmesPorMood(idMood: number, page = 1, limit = 20) {
  return prisma.filme.findMany({
    where: {
      filme_mood: { some: { IDMood: idMood } },
      ...(notDeleted.deletadoEm !== undefined ? { deletadoEm: null } : {}),
    },
    orderBy: { id: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
    select: { id: true, titulo: true, PosterUrl: true, FraseEfeito: true, AnoLancamento: true },
  });
}

export async function detalhesDoFilme(idFilme: number) {
  const filme = await prisma.filme.findFirst({ where: { id: idFilme, ...(notDeleted.deletadoEm !== undefined ? { deletadoEm: null } : {}) } });
  if (!filme) return null;
  const moods = await prisma.filme_mood.findMany({ where: { IDFilme: idFilme }, include: { mood: true } });
  const pessoas = await prisma.filme_pessoa.findMany({ where: { IDFilme: idFilme }, include: { pessoa: true } });
  return {
    id: filme.id,
    titulo: filme.titulo,
    sinopse: filme.sinopse,
    anoLancamento: filme.AnoLancamento,
    posterUrl: filme.PosterUrl,
    fraseEfeito: filme.FraseEfeito,
    moods: moods.map((m) => ({ id: m.IDMood, nome: m.mood.nome })),
    elenco: pessoas
      .filter((p) => p.papel?.toLowerCase() === 'ator' || p.papel?.toLowerCase() === 'atriz')
      .map((p) => ({ idPessoa: p.IDPessoa, nome: p.pessoa.nome, papel: p.papel, personagem: p.personagem, fotoUrl: p.pessoa.FotoUrl })),
    equipe: pessoas
      .filter((p) => p.papel?.toLowerCase() !== 'ator' && p.papel?.toLowerCase() !== 'atriz')
      .map((p) => ({ idPessoa: p.IDPessoa, nome: p.pessoa.nome, papel: p.papel, personagem: p.personagem, fotoUrl: p.pessoa.FotoUrl })),
  };
}

