import { PessoaCreateDTO, PessoaUpdateDTO } from '../schemas';
// 1. Importe os nomes corretos do repo
import { createPessoa, listPessoas, pessoasPorFilme, softDeletePessoa, updatePessoa } from '../repositories/pessoaRepo';

// 2. ATUALIZE a função listarPessoas
export function listarPessoas(q: { nome?: string; page?: number; limit?: number }) {
  // Garante que page e limit tenham valores padrão
  const params = {
    nome: q.nome,
    page: q.page ?? 1,
    limit: q.limit ?? 20,
  }
  return listPessoas(params); // Chama a nova função
}

// 3. ATUALIZE a função criarPessoa (AQUI ESTÁ A "TRADUÇÃO")
export function criarPessoa(dto: PessoaCreateDTO) {
  // Traduz de camelCase (dto) para PascalCase (banco)
  return createPessoa({ 
    Nome: dto.nome, 
    Biografia: dto.biografia, 
    FotoUrl: dto.fotoUrl 
  });
}

// 4. ATUALIZE a função atualizarPessoa (AQUI TAMBÉM)
export function atualizarPessoa(id: number, dto: PessoaUpdateDTO) {
  // Traduz de camelCase (dto) para PascalCase (banco)
  const data: any = {};
  if (dto.nome !== undefined) data.Nome = dto.nome;
  if (dto.biografia !== undefined) data.Biografia = dto.biografia;
  if (dto.fotoUrl !== undefined) data.FotoUrl = dto.fotoUrl;
  return updatePessoa(id, data);
}

export function excluirPessoa(id: number) {
  return softDeletePessoa(id);
}

export function pessoasDeFilme(idFilme: number) {
  return pessoasPorFilme(idFilme);
}