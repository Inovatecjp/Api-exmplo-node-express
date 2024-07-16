import { Router } from 'express';
import tokenController from '../controller/TokenController';
const validateResponserMiddleware = require("../../../middlewares/validateResponse");

const router = new Router();
router.use(validateResponserMiddleware);

router.post('/', tokenController.store);

export default router;
