import { prisma } from './prisma';

// associa 1 filme com vários moods
export async function associarMoodAoFilme(idFilme: number, idsMood: number[]) {
  if (!idsMood || idsMood.length === 0) return;

  const data = idsMood.map((idMood) => ({
    IDFilme: idFilme,
    IDMood: idMood,
  }));

  await prisma.filme_mood.createMany({
    data,
    skipDuplicates: true, // não quebra se já existir
  });
}

// associa 1 pessoa a 1 filme (ator ou diretor)
export async function associarPessoaAoFilme(options: {
  idFilme: number;
  idPessoa: number;
  papel: string;
  personagem?: string;
}) {
  const { idFilme, idPessoa, papel, personagem } = options;

  await prisma.filme_pessoa.create({
    data: {
      IDFilme: idFilme,
      IDPessoa: idPessoa,
      Papel: papel,
      Personagem: personagem ?? null,
    },
  });
}
