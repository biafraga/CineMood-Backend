// src/services/filmeService.ts
import {
  AssociarMoodDTO,
  AssociarPessoaDTO,
  FilmeCreateDTO,
  FilmeUpdateDTO,
} from '../schemas';
import {
  associarMoodAoFilme,
  associarPessoaAoFilme,
} from '../repositories/associacaoRepo';
import {
  createFilme,
  detalhesDoFilme,
  filmesPorMood,
  getFilme,
  listFilmes,
  softDeleteFilme,
  updateFilme,
} from '../repositories/filmeRepo';

// LISTAR FILMES (usa repo e devolve { data, total })
export function listarFilmes(q: {
  titulo?: string;
  anoLancamento?: number;
  page?: number;
  limit?: number;
}) {
  const params = {
    titulo: q.titulo,
    anoLancamento: q.anoLancamento,
    page: q.page ?? 1,
    limit: q.limit ?? 20,
  };
  return listFilmes(params);
}

export function obterFilme(id: number) {
  return getFilme(id);
}

// CRIAR FILME (traduz camelCase -> PascalCase do banco)
export function criarFilme(dto: FilmeCreateDTO) {
  return createFilme({
    Titulo: dto.titulo,
    Sinopse: dto.sinopse ?? '',
    AnoLancamento: dto.anoLancamento,
    PosterUrl: dto.posterUrl ?? '',
    FraseEfeito: dto.fraseEfeito ?? '',
  });
}

// ATUALIZAR FILME
export function atualizarFilme(id: number, dto: FilmeUpdateDTO) {
  const data: any = {};
  if (dto.titulo !== undefined) data.Titulo = dto.titulo;
  if (dto.sinopse !== undefined) data.Sinopse = dto.sinopse;
  if (dto.anoLancamento !== undefined) data.AnoLancamento = dto.anoLancamento;
  if (dto.posterUrl !== undefined) data.PosterUrl = dto.posterUrl;
  if (dto.fraseEfeito !== undefined) data.FraseEfeito = dto.fraseEfeito;

  return updateFilme(id, data);
}

export function excluirFilme(id: number) {
  return softDeleteFilme(id);
}

// as funções abaixo podem até nem ser usadas pelo front agora,
// mas podem ficar aqui sem problema
export function filmesPorIdMood(idMood: number, page?: number, limit?: number) {
  return filmesPorMood(idMood, page, limit);
}

export function detalhesFilme(idFilme: number) {
  return detalhesDoFilme(idFilme);
}

export function associarMoodsFilme(dto: AssociarMoodDTO) {
  return associarMoodAoFilme(dto.idFilme, dto.idsMood);
}

export function associarPessoaFilme(dto: AssociarPessoaDTO) {
  return associarPessoaAoFilme(dto);
}
