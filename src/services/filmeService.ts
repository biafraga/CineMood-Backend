import { AssociarMoodDTO, AssociarPessoaDTO, FilmeCreateDTO, FilmeUpdateDTO } from '../schemas';
import { associarMoods, associarPessoa } from '../repositories/associacaoRepo';
import { createFilme, detalhesDoFilme, filmesPorMood, getFilme, listFilmes, softDeleteFilme, updateFilme } from '../repositories/filmeRepo';

export function listarFilmes(q: { titulo?: string; anoLancamento?: number; page?: number; limit?: number }) {
  return listFilmes(q);
}

export function obterFilme(id: number) {
  return getFilme(id);
}

export function criarFilme(dto: FilmeCreateDTO) {
  return createFilme({
    titulo: dto.titulo,
    sinopse: dto.sinopse,
    AnoLancamento: dto.anoLancamento,
    PosterUrl: dto.posterUrl,
    FraseEfeito: dto.fraseEfeito,
  });
}

export function atualizarFilme(id: number, dto: FilmeUpdateDTO) {
  const data: any = {};
  if (dto.titulo !== undefined) data.titulo = dto.titulo;
  if (dto.sinopse !== undefined) data.sinopse = dto.sinopse;
  if (dto.anoLancamento !== undefined) data.AnoLancamento = dto.anoLancamento;
  if (dto.posterUrl !== undefined) data.PosterUrl = dto.posterUrl;
  if (dto.fraseEfeito !== undefined) data.FraseEfeito = dto.fraseEfeito;
  return updateFilme(id, data);
}

export function excluirFilme(id: number) {
  return softDeleteFilme(id);
}

export function filmesPorIdMood(idMood: number, page?: number, limit?: number) {
  return filmesPorMood(idMood, page, limit);
}

export function detalhesFilme(idFilme: number) {
  return detalhesDoFilme(idFilme);
}

export function associarMoodsFilme(dto: AssociarMoodDTO) {
  return associarMoods(dto.idFilme, dto.idsMood);
}

export function associarPessoaFilme(dto: AssociarPessoaDTO) {
  return associarPessoa(dto);
}

