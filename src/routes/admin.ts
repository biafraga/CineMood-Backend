import { Router } from 'express';
import { adminLogin } from '../controllers/authController';
import { authAdmin } from '../middlewares/auth';
import { loginRateLimiter } from '../middlewares/rateLimit';
import {
  adminAssociarMood,
  adminAssociarPessoa,
  adminCreateFilme,
  adminCreatePessoa,
  adminDeleteFilme,
  adminDeletePessoa,
  adminListFilmes,
  adminListPessoas,
  adminUpdateFilme,
  adminUpdatePessoa,
} from '../controllers/adminController';

export const adminRouter = Router();

adminRouter.post('/admin/login', loginRateLimiter, adminLogin);

adminRouter.use(authAdmin);

adminRouter.get('/filmes', adminListFilmes);
adminRouter.post('/filmes', adminCreateFilme);
adminRouter.put('/filmes/:idFilme', adminUpdateFilme);
adminRouter.delete('/filmes/:idFilme', adminDeleteFilme);

adminRouter.get('/pessoas', adminListPessoas);
adminRouter.post('/pessoas', adminCreatePessoa);
adminRouter.put('/pessoas/:idPessoa', adminUpdatePessoa);
adminRouter.delete('/pessoas/:idPessoa', adminDeletePessoa);

adminRouter.post('/filmes/associar-mood', adminAssociarMood);
adminRouter.post('/filmes/associar-pessoa', adminAssociarPessoa);

