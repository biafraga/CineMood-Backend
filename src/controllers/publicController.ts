import { Request, Response } from 'express';
import { detalhesFilme, filmesPorIdMood, listarFilmes } from '../services/filmeService';
import { listarMoods } from '../services/moodService';
import { listarPessoas, pessoasDeFilme } from '../services/pessoaService';

export async function getMoods(_req: Request, res: Response) {
  const moods = await listarMoods();
  res.json(moods.map((m) => ({ id: m.id, nome: m.nome, descricao: m.descricao, iconeUrl: m.IconeUrl })));
}

export async function getFilmesPorMood(req: Request, res: Response) {
  const idMood = Number(req.params.idMood);
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);
  const filmes = await filmesPorIdMood(idMood, page, limit);
  res.json(
    filmes.map((f) => ({
      id: f.id,
      titulo: f.titulo,
      posterUrl: (f as any).PosterUrl,
      fraseEfeito: (f as any).FraseEfeito,
      anoLancamento: (f as any).AnoLancamento,
    }))
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
    pessoas.map((p) => ({
      idPessoa: p.IDPessoa,
      nome: p.pessoa.nome,
      papel: p.papel,
      personagem: p.personagem,
      fotoUrl: p.pessoa.FotoUrl,
    }))
  );
}

export async function getFilmesPublic(req: Request, res: Response) {
  const { titulo, anoLancamento, page, limit } = req.query;
  const data = await listarFilmes({
    titulo: titulo?.toString(),
    anoLancamento: anoLancamento ? Number(anoLancamento) : undefined,
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
  });
  res.json(
    data.map((f: any) => ({
      id: f.id,
      titulo: f.titulo,
      sinopse: f.sinopse,
      anoLancamento: f.AnoLancamento,
      posterUrl: f.PosterUrl,
      fraseEfeito: f.FraseEfeito,
    }))
  );
}

export async function getPessoasPublic(req: Request, res: Response) {
  const { nome, page, limit } = req.query;
  const data = await listarPessoas({
    nome: nome?.toString(),
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
  });
  res.json(data.map((p: any) => ({ id: p.id, nome: p.nome, biografia: p.biografia, fotoUrl: p.FotoUrl })));
}
