import { Router } from 'express';
import UsersController from '../controller/usersController';
import TeamsController from '../controller/teamsController';

const router = Router();

router.post('/login', UsersController.login);
router.get('/login/validate', UsersController.validate);
router.get('/teams', TeamsController.getAll);
router.get('/teams/:id', TeamsController.getOne);
router.get('/matches', TeamsController.getOne);

export default router;
