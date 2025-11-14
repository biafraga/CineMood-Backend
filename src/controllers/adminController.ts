import { Request, Response } from 'express';
import { associarMoodSchema, associarPessoaSchema, filmeCreateSchema, filmeUpdateSchema, pessoaCreateSchema, pessoaUpdateSchema } from '../schemas';
import { associarMoodsFilme, associarPessoaFilme, atualizarFilme, criarFilme, excluirFilme, listarFilmes } from '../services/filmeService';
import { atualizarPessoa, criarPessoa, excluirPessoa, listarPessoas } from '../services/pessoaService';

// Filmes
export async function adminListFilmes(req: Request, res: Response) {
  const { titulo, anoLancamento, page, limit } = req.query;
  const data = await listarFilmes({
    titulo: titulo?.toString(),
    anoLancamento: anoLancamento ? Number(anoLancamento) : undefined,
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
  });
  res.json(data.map((f: any) => ({
    id: f.id,
    titulo: f.titulo,
    sinopse: f.sinopse,
    anoLancamento: f.AnoLancamento,
    posterUrl: f.PosterUrl,
    fraseEfeito: f.FraseEfeito,
  })));
}

export async function adminCreateFilme(req: Request, res: Response) {
  const dto = filmeCreateSchema.parse(req.body);
  const f = await criarFilme(dto);
  res.status(201).json({ id: f.id });
}

export async function adminUpdateFilme(req: Request, res: Response) {
  const id = Number(req.params.idFilme);
  const dto = filmeUpdateSchema.parse(req.body);
  await atualizarFilme(id, dto);
  res.status(204).end();
}

export async function adminDeleteFilme(req: Request, res: Response) {
  const id = Number(req.params.idFilme);
  await excluirFilme(id);
  res.status(204).end();
}

// Pessoas
export async function adminListPessoas(req: Request, res: Response) {
  const { nome, page, limit } = req.query;
  const data = await listarPessoas({
    nome: nome?.toString(),
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
  });
  res.json(data.map((p: any) => ({ id: p.id, nome: p.nome, biografia: p.biografia, fotoUrl: p.FotoUrl })));
}

export async function adminCreatePessoa(req: Request, res: Response) {
  const dto = pessoaCreateSchema.parse(req.body);
  const p = await criarPessoa(dto);
  res.status(201).json({ id: p.id });
}

export async function adminUpdatePessoa(req: Request, res: Response) {
  const id = Number(req.params.idPessoa);
  const dto = pessoaUpdateSchema.parse(req.body);
  await atualizarPessoa(id, dto);
  res.status(204).end();
}

export async function adminDeletePessoa(req: Request, res: Response) {
  const id = Number(req.params.idPessoa);
  await excluirPessoa(id);
  res.status(204).end();
}

// Associações
export async function adminAssociarMood(req: Request, res: Response) {
  const dto = associarMoodSchema.parse(req.body);
  await associarMoodsFilme(dto);
  res.status(204).end();
}

export async function adminAssociarPessoa(req: Request, res: Response) {
  const dto = associarPessoaSchema.parse(req.body);
  await associarPessoaFilme(dto);
  res.status(204).end();
}

