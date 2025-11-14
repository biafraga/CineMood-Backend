import { Router } from 'express';
import { getFilmeDetalhes, getFilmesPorMood, getMoods, getPessoasPorFilme, getFilmesPublic, getPessoasPublic } from '../controllers/publicController';

export const publicRouter = Router();

publicRouter.get('/moods', getMoods);
publicRouter.get('/filmes/mood/:idMood', getFilmesPorMood);
publicRouter.get('/filmes/:idFilme', getFilmeDetalhes);
publicRouter.get('/pessoas/filme/:idFilme', getPessoasPorFilme);
publicRouter.get('/filmes', getFilmesPublic);
publicRouter.get('/pessoas', getPessoasPublic);
