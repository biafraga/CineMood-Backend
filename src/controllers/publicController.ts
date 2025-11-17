import { Request, Response } from 'express';
import { detalhesFilme, filmesPorIdMood, listarFilmes } from '../services/filmeService';
import { listarMoods } from '../services/moodService';
import { listarPessoas, pessoasDeFilme } from '../services/pessoaService';

export async function getMoods(req: Request, res: Response) {
  // Pega a página e o limite da URL
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);

  // Chama o serviço (que agora retorna { data, total })
  const { data, total } = await listarMoods(page, limit);

  // Envia o JSON no formato { data, total }
  res.json({
    data: data.map((m: any) => ({
      id: m.ID, // CORRIGIDO (para bater com o repo)
      nome: m.Nome, // CORRIGIDO
      descricao: m.Descricao, // CORRIGIDO
      iconeUrl: m.IconeUrl
    })),
    total: total,
  });
}

export async function getFilmesPorMood(req: Request, res: Response) {
  const idMood = Number(req.params.idMood);
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);
  const filmes = await filmesPorIdMood(idMood, page, limit);
  res.json(
    filmes.map((f) => ({
      id: f.ID,
      titulo: f.Titulo,
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
      nome: p.pessoa.Nome,
      papel: p.Papel,
      personagem: p.Personagem,
      fotoUrl: p.pessoa.FotoUrl,
    }))
  );
}

// ==========================================================
// FUNÇÃO DE FILMES CORRIGIDA (PARA O DASHBOARD)
// ==========================================================
export async function getFilmesPublic(req: Request, res: Response) {
  const { titulo, anoLancamento, page, limit } = req.query;

  // Chama o serviço (que agora retorna { data, total })
  const { data, total } = await listarFilmes({
    titulo: titulo?.toString(),
    anoLancamento: anoLancamento ? Number(anoLancamento) : undefined,
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
  });

  // Envia o JSON no formato { data, total }
  res.json({
    data: data.map((f: any) => ({
      id: f.ID, // CORRIGIDO
      titulo: f.Titulo, // CORRIGIDO
      sinopse: f.Sinopse, // CORRIGIDO
      anoLancamento: f.AnoLancamento,
      posterUrl: f.PosterUrl,
      fraseEfeito: f.FraseEfeito,
    })),
    total: total, // AQUI ESTÁ O TOTAL!
  });
}

// ==========================================================
// FUNÇÃO DE PESSOAS CORRIGIDA (PARA O DASHBOARD)
// ==========================================================
export async function getPessoasPublic(req: Request, res: Response) {
  const { nome, page, limit } = req.query;

  // Chama o serviço (que agora retorna { data, total })
  const { data, total } = await listarPessoas({
    nome: nome?.toString(),
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
  });

  // Envia o JSON no formato { data, total }
  res.json({
    data: data.map((p: any) => ({
      id: p.ID, // CORRIGIDO
      nome: p.Nome, // CORRIGIDO
      biografia: p.Biografia, // CORRIGIDO
      fotoUrl: p.FotoUrl
    })),
    total: total, // AQUI ESTÁ O TOTAL!
  });
}