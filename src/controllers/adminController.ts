// src/controllers/adminController.ts
import { Request, Response } from 'express';
import {
  associarMoodSchema,
  associarPessoaSchema,
  filmeCreateSchema,
  filmeUpdateSchema,
  pessoaCreateSchema,
  pessoaUpdateSchema,
} from '../schemas';
import {
  associarMoodsFilme,
  associarPessoaFilme,
  atualizarFilme,
  criarFilme,
  excluirFilme,
  listarFilmes,
} from '../services/filmeService';
import {
  atualizarPessoa,
  criarPessoa,
  excluirPessoa,
  listarPessoas,
} from '../services/pessoaService';

// ================= FILMES =================

export async function adminListFilmes(req: Request, res: Response) {
  const { titulo, anoLancamento, page, limit } = req.query;

  const result = await listarFilmes({
    titulo: titulo?.toString(),
    anoLancamento: anoLancamento ? Number(anoLancamento) : undefined,
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
  });

  const filmesFormatados = result.data.map((f: any) => {
    // diretor = primeira pessoa com Papel 'Diretor'
    const diretor = (f.filme_pessoa ?? []).find(
      (p: any) => p.Papel?.toLowerCase() === 'diretor'
    );

    // lista de moods pelo nome
    const moods = (f.filme_mood ?? []).map((fm: any) => fm.mood.Nome);

    return {
      id: f.ID,
      titulo: f.Titulo,
      sinopse: f.Sinopse,
      anoLancamento: f.AnoLancamento,
      posterUrl: f.PosterUrl,
      fraseEfeito: f.FraseEfeito,
      diretorNome: diretor?.pessoa?.Nome ?? null,
      moods,
    };
  });

  res.json({
    data: filmesFormatados,
    total: result.total,
  });
}

export async function adminCreateFilme(req: Request, res: Response) {
  const dto = filmeCreateSchema.parse(req.body);
  const filme = await criarFilme(dto); // service cuida de falar com o repo

  // se o service já normalizar pra camelCase, usa filme.id;
  // se não, filme.ID. aqui deixei bem genérico:
  const id = (filme as any).id ?? (filme as any).ID;

  res.status(201).json({ id });
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

// ================ PESSOAS =================

export async function adminListPessoas(req: Request, res: Response) {
  const { nome, page, limit } = req.query;

  const result = await listarPessoas({
    nome: nome?.toString(),
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
  });

  res.json({
    data: result.data.map((p: any) => ({
      id: p.ID,
      nome: p.Nome,
      biografia: p.Biografia,
      fotoUrl: p.FotoUrl,
    })),
    total: result.total,
  });
}

export async function adminCreatePessoa(req: Request, res: Response) {
  const dto = pessoaCreateSchema.parse(req.body);
  const pessoa = await criarPessoa(dto);

  const id = (pessoa as any).id ?? (pessoa as any).ID;

  res.status(201).json({ id });
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

// =============== ASSOCIAÇÕES ===============

// associa filme x moods
export async function adminAssociarMood(req: Request, res: Response) {
  const dto = associarMoodSchema.parse(req.body);
  await associarMoodsFilme(dto); // usa o service, que já fala com o repo
  res.status(204).end();
}

// associa filme x pessoa (ator / diretor)
export async function adminAssociarPessoa(req: Request, res: Response) {
  const dto = associarPessoaSchema.parse(req.body);
  await associarPessoaFilme(dto); // idem
  res.status(204).end();
}
