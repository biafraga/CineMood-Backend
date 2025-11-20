import { prisma } from './prisma';

type FilmeData = {
  Titulo: string;
  Sinopse: string;
  AnoLancamento: number;
  PosterUrl: string;
  FraseEfeito: string;
};

type FilmeUpdateData = Partial<FilmeData>;

const notDeleted = { deletadoEm: null as any };

// 1) LISTAR FILMES → retorna { data, total }
export async function listFilmes(params: {
  titulo?: string;
  anoLancamento?: number;
  page?: number;
  limit?: number;
}) {
  const { titulo, anoLancamento, page = 1, limit = 20 } = params;

  const where: any = {
    ...(titulo ? { Titulo: { contains: titulo } } : {}),
    ...(anoLancamento ? { AnoLancamento: anoLancamento } : {}),
    ...(notDeleted.deletadoEm !== undefined ? { deletadoEm: null } : {}),
  };

  const [data, total] = await prisma.$transaction([
    prisma.filme.findMany({
      where,
      orderBy: { ID: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        filme_mood: { include: { mood: true } },
        filme_pessoa: { include: { pessoa: true } },
      },
    }),
    prisma.filme.count({ where }),
  ]);

  return { data, total };
}

// 2) OBTER FILME
export function getFilme(id: number) {
  return prisma.filme.findFirst({
    where: { ID: id, ...notDeleted },
  });
}

// 3) CRIAR FILME
export function createFilme(data: FilmeData) {
  return prisma.filme.create({ data });
}

// 4) ATUALIZAR FILME
export function updateFilme(id: number, data: FilmeUpdateData) {
  return prisma.filme.update({
    where: { ID: id },
    data,
  });
}

// 5) SOFT DELETE
export function softDeleteFilme(id: number) {
  return prisma.filme.update({
    where: { ID: id },
    data: { deletadoEm: new Date() },
  });
}

// 6) FILMES POR MOOD
export function filmesPorMood(idMood: number, page = 1, limit = 20) {
  return prisma.filme.findMany({
    where: {
      filme_mood: { some: { IDMood: idMood } },
      deletadoEm: null,
    },
    skip: (page - 1) * limit,
    take: limit,
  });
}

// 7) DETALHES DO FILME
export async function detalhesDoFilme(idFilme: number) {
  const filme = await prisma.filme.findFirst({
    where: { ID: idFilme, deletadoEm: null },
  });
  if (!filme) return null;

  const moods = await prisma.filme_mood.findMany({
    where: { IDFilme: idFilme },
    include: { mood: true },
  });

  const pessoas = await prisma.filme_pessoa.findMany({
    where: { IDFilme: idFilme },
    include: { pessoa: true },
  });

  return {
    id: filme.ID,
    titulo: filme.Titulo,
    sinopse: filme.Sinopse,
    anoLancamento: filme.AnoLancamento,
    posterUrl: filme.PosterUrl,
    fraseEfeito: filme.FraseEfeito,
    moods: moods.map((m: any) => ({ id: m.IDMood, nome: m.mood.Nome })),
    elenco: pessoas
      .filter((p: any) => p.Papel.toLowerCase() !== 'diretor')
      .map((p: any) => ({ idPessoa: p.IDPessoa, nome: p.pessoa.Nome, papel: p.Papel })),
    equipe: pessoas
      .filter((p: any) => p.Papel.toLowerCase() === 'diretor')
      .map((p: any) => ({ idPessoa: p.IDPessoa, nome: p.pessoa.Nome, papel: p.Papel })),
  };
}
