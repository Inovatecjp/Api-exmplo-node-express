import { Router } from 'express';
import GrandsController from '../controller/GrandsController';

import loginRequired from '../../../middlewares/loginRequired';



const router = new Router();

// Não deveria existir
router.get('/', GrandsController.index); // Lista usuários
router.get('/ligacao', GrandsController.indexligaçoes); // Lista usuários

// router.get('/:id', GrandsController.show); // Lista usuário

router.post('/',GrandsController.store);


router.put('/', GrandsController.update);
router.delete('/', GrandsController.delete);

export default router;
