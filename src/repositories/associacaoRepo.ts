import { prisma } from './prisma';

export async function associarMoods(idFilme: number, idsMood: number[]) {
  const data = idsMood.map((id) => ({ IDFilme: idFilme, IDMood: id }));
  await prisma.$transaction([
    prisma.filme_mood.deleteMany({ where: { IDFilme: idFilme, NOT: { IDMood: { in: idsMood } } } }),
    prisma.filme_mood.createMany({ data, skipDuplicates: true }),
  ]);
}

export function associarPessoa(params: { idFilme: number; idPessoa: number; papel: string; personagem?: string }) {
  const { idFilme, idPessoa, papel, personagem } = params;
  return prisma.filme_pessoa.upsert({
    where: {
      IDFilme_IDPessoa_papel: { IDFilme: idFilme, IDPessoa: idPessoa, papel },
    },
    create: { IDFilme: idFilme, IDPessoa: idPessoa, papel, personagem },
    update: { personagem },
  });
}

