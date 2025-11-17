import { prisma } from './prisma';

const notDeleted = { deletadoEm: null as any };

type PessoaData = {
  Nome: string;
  Biografia?: string;
  FotoUrl?: string;
}
type PessoaUpdateData = Partial<PessoaData>;

//Modifique a função listPessoas para retornar { data, total }
export async function listPessoas(params: { nome?: string; page?: number; limit?: number }) {
  // Garante valores padrão
  const { nome, page = 1, limit = 20 } = params;

  // Condição de busca (filtro)
  const where: any = {
    ...notDeleted,
    ...(nome && { Nome: { contains: nome } }), // CORRIGIDO: Nome
  };

  const [data, total] = await prisma.$transaction([
    prisma.pessoa.findMany({
      where,
      orderBy: { ID: 'desc' }, // CORRIGIDO: ID
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.pessoa.count({ where }), // ADICIONADO: Pega o total
  ]);

  return { data, total }; // ATUALIZADO: Retorna o objeto
}

//Funções restantes CORRIGIDAS (id -> ID e Tipos)
export function createPessoa(data: PessoaData) { // CORRIGIDO: Usa o tipo
  return prisma.pessoa.create({ data });
}

export function updatePessoa(id: number, data: PessoaUpdateData) { // CORRIGIDO: Usa o tipo
  return prisma.pessoa.update({ where: { ID: id }, data }); // CORRIGIDO: ID
}

export function softDeletePessoa(id: number) {
  return prisma.pessoa.update({ where: { ID: id }, data: { deletadoEm: new Date() } as any }); // CORRIGIDO: ID
}

export function pessoasPorFilme(idFilme: number) {
  return prisma.filme_pessoa.findMany({ where: { IDFilme: idFilme }, include: { pessoa: true } });
}