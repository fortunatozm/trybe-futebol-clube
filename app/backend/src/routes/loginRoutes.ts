import { Router } from 'express';
import UsersController from '../controller/usersController';

const router = Router();

router.post('/login', UsersController.login);
router.get('/login/validate', UsersController.validate);

export default router;
