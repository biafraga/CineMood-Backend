import { prisma } from './prisma';

const notDeleted = { deletadoEm: null as any };

// 1. Definição dos "tipos" para corrigir os erros vermelhos
type FilmeData = {
  Titulo: string;
  Sinopse?: string;
  AnoLancamento: number;
  PosterUrl?: string;
  FraseEfeito?: string;
}

type FilmeUpdateData = Partial<FilmeData>;


// 2. Função "listFilmes" ATUALIZADA para retornar { data, total }
export async function listFilmes(params: { titulo?: string; anoLancamento?: number; page?: number; limit?: number }) {
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
        filme_mood: { include: { mood: true } },      // moods relacionados
        filme_pessoa: { include: { pessoa: true } },  // pessoas relacionadas
      },
    }),
    prisma.filme.count({ where }),
  ]);

  return { data, total };
}


// 3. Funções restantes CORRIGIDAS (id -> ID)
export function getFilme(id: number) {
  return prisma.filme.findFirst({
    where: { ID: id, ...(notDeleted.deletadoEm !== undefined ? { deletadoEm: null } : {}) }, // CORRIGIDO: ID
  });
}

export function updateFilme(id: number, data: FilmeUpdateData) { // CORRIGIDO: Usa o tipo
  return prisma.filme.update({ where: { ID: id }, data }); // CORRIGIDO: ID
}

export function softDeleteFilme(id: number) {
  return prisma.filme.update({ where: { ID: id }, data: { deletadoEm: new Date() } as any }); // CORRIGIDO: ID
}

export function filmesPorMood(idMood: number, page = 1, limit = 20) {
  return prisma.filme.findMany({
    where: {
      filme_mood: { some: { IDMood: idMood } },
      ...(notDeleted.deletadoEm !== undefined ? { deletadoEm: null } : {}),
    },
    orderBy: { ID: 'desc' }, // CORRIGIDO: ID
    skip: (page - 1) * limit,
    take: limit,
    select: { ID: true, Titulo: true, PosterUrl: true, FraseEfeito: true, AnoLancamento: true }, // CORRIGIDO: PascalCase
  });
}

export async function detalhesDoFilme(idFilme: number) {
  const filme = await prisma.filme.findFirst({ where: { ID: idFilme, ...(notDeleted.deletadoEm !== undefined ? { deletadoEm: null } : {}) } }); // CORRIGIDO: ID
  if (!filme) return null;
  const moods = await prisma.filme_mood.findMany({ where: { IDFilme: idFilme }, include: { mood: true } });
  const pessoas = await prisma.filme_pessoa.findMany({ where: { IDFilme: idFilme }, include: { pessoa: true } });
  
  return {
    id: filme.ID,
    titulo: filme.Titulo,
    sinopse: filme.Sinopse,
    anoLancamento: filme.AnoLancamento,
    posterUrl: filme.PosterUrl,
    fraseEfeito: filme.FraseEfeito,
    moods: moods.map((m) => ({ id: m.IDMood, nome: m.mood.Nome })),
    elenco: pessoas
      .filter((p) => p.Papel?.toLowerCase() === 'ator' || p.Papel?.toLowerCase() === 'atriz')
      .map((p) => ({ idPessoa: p.IDPessoa, nome: p.pessoa.Nome, papel: p.Papel, personagem: p.Personagem, fotoUrl: p.pessoa.FotoUrl })),
    equipe: pessoas
      .filter((p) => p.Papel?.toLowerCase() !== 'ator' && p.Papel?.toLowerCase() !== 'atriz')
      .map((p) => ({ idPessoa: p.IDPessoa, nome: p.pessoa.Nome, papel: p.Papel, personagem: p.Personagem, fotoUrl: p.pessoa.FotoUrl })),
  };

  
  
}