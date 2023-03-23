import { Request, Response } from 'express';
import LeadersBoardService from '../services/leadersBoardService';

export default class LeaderboardController {
  static async getLeaderboardHome(_req: Request, res: Response) {
    const scoreBoard = await LeadersBoardService.getLeaderboardHome();
    res.status(200).json(scoreBoard);
  }

  static async getLeaderboardAway(_req: Request, res: Response) {
    const scoreBoard = await LeadersBoardService.getLeaderboardAway();
    res.status(200).json(scoreBoard);
  }

  static async getLeaderboard(_req: Request, res: Response) {
    const scoreBoard = await LeadersBoardService.getLeaderboard();
    res.status(200).json(scoreBoard);
  }
}
