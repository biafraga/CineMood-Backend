import { prisma } from './prisma';

// 1. Defina o "tipo" do Mood (para tirar o erro vermelho)
type Mood = {
  ID: number;
  Nome: string;
  Descricao: string | null;
  IconeUrl: string | null;
}

// 2. Modifique a função listMoods para retornar { data, total }
export async function listMoods(page: number, limit: number) {
  
  // Condição de busca (filtro)
  const where = {}; // (Não temos filtros para mood, mas o .count() precisa)

  const [data, total] = await prisma.$transaction([
    prisma.mood.findMany({
      where,
      orderBy: { Nome: 'asc' }, // CORRIGIDO: Nome (PascalCase)
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.mood.count({ where }), // ADICIONADO: Pega o total
  ]);
  
  return { data, total }; // ATUALIZADO: Retorna o objeto
}