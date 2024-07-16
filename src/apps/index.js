import { Router } from 'express';
import autenticacao from './Autenticacao/routes';

const router = new Router();


router.use('/accounts', autenticacao); // Lista usuários




export default router;

/*
index -> lista todos os usuários -> GET
store/create -> cria um novo usuário -> POST
delete -> apaga um usuário -> DELETE
show -> mostra um usuário -> GET
update -> atualiza um usuário -> PATCH ou PUT
*/
