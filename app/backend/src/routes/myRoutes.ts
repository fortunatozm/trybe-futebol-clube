import { Router } from 'express';
import UsersController from '../controller/usersController';
import TeamsController from '../controller/teamsController';
import MatchesController from '../controller/matchesController';
import leadersBoardControl from '../controller/leadersBoardControl';
import Token from '../midwares/token';

const router = Router();

router.post('/login', UsersController.login);
router.get('/login/validate', UsersController.validate);
// router.use(Token);
router.get('/teams', TeamsController.getAll);
router.get('/teams/:id', TeamsController.getOne);
router.get('/matches', MatchesController.getAll);
router.post('/matches', Token, MatchesController.createMatch);
router.patch('/matches/:id', MatchesController.updateMatch);
router.patch('/matches/:id/finish', MatchesController.finishMatch);
router.get('/leaderboard', leadersBoardControl.getLeaderboard);
router.get('/leaderboard/home', leadersBoardControl.getLeaderboardHome);
router.get('/leaderboard/away', leadersBoardControl.getLeaderboardAway);

export default router;
