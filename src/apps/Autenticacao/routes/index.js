import { Router } from 'express';
import GrandsRoutes from './GrandsRoutes';
import profileRoutes from './profileRoutes';
import tokenRoutes from './tokenRoutes';
import userRoutes from './userRoutes';


import AuthMiddleware from '../../../middlewares/auth';
const validateResponserMiddleware = require("../../../middlewares/validateResponse");


const router = new Router();
router.use(validateResponserMiddleware);


// router.get('/useresNotTreino/',AuthMiddleware, userController.indexAll); // Lista usuários
router.use('/grands', GrandsRoutes); // Lista usuários

router.use('/profile', profileRoutes); // Lista usuário

router.use('/tokens', tokenRoutes);
router.use('/Users',userRoutes);




export default router;

/*
index -> lista todos os usuários -> GET
store/create -> cria um novo usuário -> POST
delete -> apaga um usuário -> DELETE
show -> mostra um usuário -> GET
update -> atualiza um usuário -> PATCH ou PUT
*/
