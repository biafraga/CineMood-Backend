// src/controllers/publicController.ts
import { Request, Response } from 'express';
import { detalhesFilme, filmesPorIdMood, listarFilmes } from '../services/filmeService';
import { listarMoods } from '../services/moodService';
import { listarPessoas, pessoasDeFilme } from '../services/pessoaService';

export async function getMoods(req: Request, res: Response) {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);

  const { data, total } = await listarMoods(page, limit);

  res.json({
    data: data.map((m: any) => ({
      id: m.ID,
      nome: m.Nome,
      descricao: m.Descricao,
      iconeUrl: m.IconeUrl,
    })),
    total,
  });
}

export async function getFilmesPorMood(req: Request, res: Response) {
  const idMood = Number(req.params.idMood);
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);
  const filmes = await filmesPorIdMood(idMood, page, limit);

  res.json(
    filmes.map((f: any) => ({
      id: f.ID,
      titulo: f.Titulo,
      posterUrl: f.PosterUrl,
      fraseEfeito: f.FraseEfeito,
      anoLancamento: f.AnoLancamento,
    })),
  );
}

export async function getFilmeDetalhes(req: Request, res: Response) {
  const idFilme = Number(req.params.idFilme);
  const det = await detalhesFilme(idFilme);
  if (!det) return res.status(404).json({ error: 'Não encontrado', message: 'Filme não existe' });
  res.json(det);
}

export async function getPessoasPorFilme(req: Request, res: Response) {
  const idFilme = Number(req.params.idFilme);
  const pessoas = await pessoasDeFilme(idFilme);
  res.json(
    pessoas.map((p: any) => ({
      idPessoa: p.IDPessoa,
      nome: p.pessoa.Nome,
      papel: p.Papel,
      personagem: p.Personagem,
      fotoUrl: p.pessoa.FotoUrl,
    })),
  );
}

// ==========================================================
// LISTA DE FILMES PÚBLICA (SEM MOOD / DIRETOR)
// ==========================================================
export async function getFilmesPublic(req: Request, res: Response) {
  const { titulo, anoLancamento, page, limit } = req.query;

  const { data, total } = await listarFilmes({
    titulo: titulo?.toString(),
    anoLancamento: anoLancamento ? Number(anoLancamento) : undefined,
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
  });

  const filmes = data.map((f: any) => ({
    id: f.ID,
    titulo: f.Titulo,
    sinopse: f.Sinopse,
    anoLancamento: f.AnoLancamento,
    posterUrl: f.PosterUrl,
    fraseEfeito: f.FraseEfeito,
  }));

  return res.json({ data: filmes, total });
}

// ==========================================================
// PESSOAS PÚBLICO (mantém igual)
// ==========================================================
export async function getPessoasPublic(req: Request, res: Response) {
  const { nome, page, limit } = req.query;

  const { data, total } = await listarPessoas({
    nome: nome?.toString(),
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
  });

  res.json({
    data: data.map((p: any) => ({
      id: p.ID,
      nome: p.Nome,
      biografia: p.Biografia,
      fotoUrl: p.FotoUrl,
    })),
    total,
  });
}
