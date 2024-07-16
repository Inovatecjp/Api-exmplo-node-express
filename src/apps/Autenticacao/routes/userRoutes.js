import { Router } from 'express';
import userController from '../controller/UserController';


import AuthMiddleware from '../../../middlewares/auth';
const validateResponserMiddleware = require("../../../middlewares/validateResponse");


const router = new Router();
router.use(validateResponserMiddleware);


router.post('/RecuperarSenha', userController.RecuperarSenha);
router.post('/', userController.store); 
router.get('/AllUSers',AuthMiddleware, userController.indexAll); // Lista usuários

router.get('/',AuthMiddleware, userController.show); // Lista usuário

router.post('/MudarSenha',AuthMiddleware, userController.MudarSenha);


router.put('/', AuthMiddleware, userController.updat);


router.delete('/', AuthMiddleware, userController.delete);




export default router;

/*
index -> lista todos os usuários -> GET
store/create -> cria um novo usuário -> POST
delete -> apaga um usuário -> DELETE
show -> mostra um usuário -> GET
update -> atualiza um usuário -> PATCH ou PUT
*/
