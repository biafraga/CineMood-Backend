import { AssociarMoodDTO, AssociarPessoaDTO, FilmeCreateDTO, FilmeUpdateDTO } from '../schemas';
import { associarMoods, associarPessoa } from '../repositories/associacaoRepo';
import { createFilme, detalhesDoFilme, filmesPorMood, getFilme, listFilmes, softDeleteFilme, updateFilme } from '../repositories/filmeRepo';

//ATUALIZE a função listarFilmes
export function listarFilmes(q: { titulo?: string; anoLancamento?: number; page?: number; limit?: number }) {
  // Garante que page e limit tenham valores padrão
  const params = {
    titulo: q.titulo,
    anoLancamento: q.anoLancamento,
    page: q.page ?? 1,
    limit: q.limit ?? 20,
  }
  return listFilmes(params); // Chama a nova função
}

export function obterFilme(id: number) {
  return getFilme(id);
}

//ATUALIZE a função criarFilme (AQUI ESTÁ A "TRADUÇÃO")
export function criarFilme(dto: FilmeCreateDTO) {
  // Traduz de camelCase (dto) para PascalCase (banco)
  return createFilme({
    Titulo: dto.titulo,
    Sinopse: dto.sinopse,
    AnoLancamento: dto.anoLancamento,
    PosterUrl: dto.posterUrl,
    FraseEfeito: dto.fraseEfeito,
  });
}

//ATUALIZE a função atualizarFilme (AQUI TAMBÉM)
export function atualizarFilme(id: number, dto: FilmeUpdateDTO) {
  // Traduz de camelCase (dto) para PascalCase (banco)
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