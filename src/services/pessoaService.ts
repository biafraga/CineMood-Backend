import { PessoaCreateDTO, PessoaUpdateDTO } from '../schemas';
import { createPessoa, listPessoas, pessoasPorFilme, softDeletePessoa, updatePessoa } from '../repositories/pessoaRepo';

export function listarPessoas(q: { nome?: string; page?: number; limit?: number }) {
  return listPessoas(q);
}

export function criarPessoa(dto: PessoaCreateDTO) {
  return createPessoa({ nome: dto.nome, biografia: dto.biografia, FotoUrl: dto.fotoUrl });
}

export function atualizarPessoa(id: number, dto: PessoaUpdateDTO) {
  const data: any = {};
  if (dto.nome !== undefined) data.nome = dto.nome;
  if (dto.biografia !== undefined) data.biografia = dto.biografia;
  if (dto.fotoUrl !== undefined) data.FotoUrl = dto.fotoUrl;
  return updatePessoa(id, data);
}

export function excluirPessoa(id: number) {
  return softDeletePessoa(id);
}

export function pessoasDeFilme(idFilme: number) {
  return pessoasPorFilme(idFilme);
}

