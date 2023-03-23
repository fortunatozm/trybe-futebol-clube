import { Op } from 'sequelize';
import Teams from '../database/models/Teams.model';
import { IMatchIndProg, IMatch, IPoints } from '../interfaces/Interfaces';
import ErrorCode from '../CodeError';
import Matches from '../database/models/Matches.model';

class MatchesService {
  static async getTeamNames(match: IMatchIndProg) {
    const { homeTeam, awayTeam, inProgress } = match;
    const hTeamName = await Teams.findOne({ where: { id: homeTeam }, attributes: ['teamName'] })
      .then((res) => res?.teamName);
    const aTeamName = await Teams.findOne({ where: { id: awayTeam }, attributes: ['teamName'] })
      .then((res) => res?.teamName);
    return {
      ...match,
      inProgress: !!inProgress,
      teamHome: { teamName: hTeamName },
      teamAway: { teamName: aTeamName },
    };
  }

  static async getAll() {
    const matches = await Matches.findAll({ raw: true });
    const response = await Promise.all(matches.map(MatchesService.getTeamNames));
    return response;
  }

  static async getByTeamId(id: number, type = '') {
    let matches: IMatchIndProg[];
    if (type) {
      matches = await Matches.findAll({ where: { [type]: id, inProgress: false }, raw: true });
    } else {
      matches = await Matches.findAll({ where: { inProgress: false }, raw: true });
    }
    return matches;
  }

  static async getByTeam(id: number) {
    const matches = await Matches.findAll({
      where: {
        inProgress: false,
        [Op.or]: [
          { homeTeam: id },
          { awayTeam: id },
        ],
      },
      raw: true,
    });
    return matches;
  }

  static async getByProgress(progress: boolean) {
    const matches = await Matches.findAll({ where: { inProgress: progress }, raw: true });
    if (!matches) { throw new ErrorCode('No matches found', 404); }
    const response = await Promise.all(matches.map(MatchesService.getTeamNames));
    return response;
  }

  static async finishMatch(id: number) {
    const response = await Matches.update({ inProgress: false }, { where: { id } });
    return response;
  }

  static async createMatch(data: IMatch): Promise<IMatchIndProg> {
    const { homeTeam, awayTeam, homeTeamGoals, awayTeamGoals } = data;
    if (homeTeam === awayTeam) {
      throw new ErrorCode('It is not possible to create a match with two equal teams', 422);
    }
    const hTeam = await Teams.findOne({ where: { id: homeTeam } });
    const aTeam = await Teams.findOne({ where: { id: awayTeam } });
    if (!hTeam || !aTeam) {
      throw new ErrorCode('There is no team with such id!', 404);
    }
    const response = await Matches.create({
      homeTeam,
      awayTeam,
      homeTeamGoals,
      awayTeamGoals,
      inProgress: true,
    }, { raw: true });
    return response;
  }

  static async updateMatch(id: number, data: IPoints) {
    const { homeTeamGoals, awayTeamGoals } = data;
    const response = await Matches.update({ homeTeamGoals, awayTeamGoals }, { where: { id } });
    return response;
  }
}

export default MatchesService;
