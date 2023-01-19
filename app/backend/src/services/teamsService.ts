import { ITeams } from '../interfaces/Interfaces';
import Team from '../database/models/Teams.model';
import ErrorCode from '../CodeError';

class TeamsService {
  static async getAll(): Promise<ITeams[]> {
    const response = await Team.findAll({ raw: true });
    return response;
  }

  static async getOne(id: number) {
    const response = await Team.findOne({ where: { id }, raw: true });
    if (!response) throw new ErrorCode('Team not found', 404);
    return response;
  }
}

export default TeamsService;
