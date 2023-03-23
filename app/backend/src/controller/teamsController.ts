import { Request, Response } from 'express';
import TeamsService from '../services/teamsService';

class TeamsController {
  static async getAll(_req: Request, res: Response) {
    const response = await TeamsService.getAll();
    res.status(200).json(response);
  }

  static async getOne(req: Request, res: Response) {
    const { id } = req.params;
    const response = await TeamsService.getOne(+id);
    res.status(200).json(response);
  }
}

export default TeamsController;
