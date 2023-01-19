import { Request, Response } from 'express';
import MatchesService from '../services/matchesService';

class MatchesController {
  static async getAll(req: Request, res: Response) {
    const { inProgress } = req.query;
    if (inProgress !== undefined) {
      const matches = await MatchesService.getByProgress(inProgress === 'true');
      return res.status(200).json(matches);
    }
    const matches = await MatchesService.getAll();
    res.status(200).json(matches);
  }

  static async finishMatch(req: Request, res: Response) {
    const { id } = req.params;
    await MatchesService.finishMatch(+id);
    res.status(200).json({ message: 'Finished' });
  }

  static async createMatch(req: Request, res: Response) {
    const match = await MatchesService.createMatch(req.body);
    res.status(201).json(match);
  }

  static async updateMatch(req: Request, res: Response) {
    const { id } = req.params;
    const match = await MatchesService.updateMatch(+id, req.body);
    res.status(200).json(match);
  }
}

export default MatchesController;