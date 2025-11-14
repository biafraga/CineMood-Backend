import { z } from 'zod';

export const loginSchema = z.object({
  login: z.string().min(1),
  senha: z.string().min(1),
});

export const filmeCreateSchema = z.object({
  titulo: z.string().min(1),
  sinopse: z.string().optional(),
  anoLancamento: z.number().int().min(1878),
  posterUrl: z.string().url().optional(),
  fraseEfeito: z.string().optional(),
});

export const filmeUpdateSchema = filmeCreateSchema.partial();

export const pessoaCreateSchema = z.object({
  nome: z.string().min(1),
  biografia: z.string().optional(),
  fotoUrl: z.string().url().optional(),
});

export const pessoaUpdateSchema = pessoaCreateSchema.partial();

export const associarMoodSchema = z.object({
  idFilme: z.number().int(),
  idsMood: z.array(z.number().int()).min(1),
});

export const associarPessoaSchema = z.object({
  idFilme: z.number().int(),
  idPessoa: z.number().int(),
  papel: z.string().min(1),
  personagem: z.string().optional(),
});

export type LoginDTO = z.infer<typeof loginSchema>;
export type FilmeCreateDTO = z.infer<typeof filmeCreateSchema>;
export type FilmeUpdateDTO = z.infer<typeof filmeUpdateSchema>;
export type PessoaCreateDTO = z.infer<typeof pessoaCreateSchema>;
export type PessoaUpdateDTO = z.infer<typeof pessoaUpdateSchema>;
export type AssociarMoodDTO = z.infer<typeof associarMoodSchema>;
export type AssociarPessoaDTO = z.infer<typeof associarPessoaSchema>;

