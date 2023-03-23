import sequelize from '../database/models';
import { leaderboardHomeQuery, leaderboardAwayQuery } from '../database/queries/queries';
import { ILeader, ILeadeboard } from '../interfaces/Interfaces';

export default class LeaderboardService {
  static async getLeaderboardHome() {
    const [scoreBoard] = await sequelize.query(leaderboardHomeQuery);
    return scoreBoard;
  }

  static async getLeaderboardAway() {
    const [scoreBoard] = await sequelize.query(leaderboardAwayQuery);
    return scoreBoard;
  }

  static async getLeaderboard() {
    const teamsAwayScore = await LeaderboardService.getLeaderboardHome() as ILeader;
    const teamsHomeScore = await LeaderboardService.getLeaderboardAway() as ILeader;
    const mergedData : ILeader = LeaderboardService.sumScore(teamsHomeScore, teamsAwayScore);
    const unrankedLB = LeaderboardService.calcEfficiency(mergedData);
    return LeaderboardService.toRank(unrankedLB);
  }

  private static sumScore(tHomeScore: ILeader, tAwayScore: ILeader): ILeader {
    const data = tHomeScore.map((team) => {
      const awayScore = tAwayScore.find((score) => score.name === team.name);
      return {
        name: team.name,
        totalPoints: Number(team.totalPoints) + Number(awayScore?.totalPoints),
        totalGames: Number(team.totalGames) + Number(awayScore?.totalGames),
        totalVictories: Number(team.totalVictories) + Number(awayScore?.totalVictories),
        totalDraws: Number(team.totalDraws) + Number(awayScore?.totalDraws),
        totalLosses: Number(team.totalLosses) + Number(awayScore?.totalLosses),
        goalsFavor: Number(team.goalsFavor) + Number(awayScore?.goalsFavor),
        goalsOwn: Number(team.goalsOwn) + Number(awayScore?.goalsOwn),
        goalsBalance: Number(team.goalsBalance) + Number(awayScore?.goalsBalance),
      } as ILeadeboard;
    });
    return data;
  }

  private static calcEfficiency(score: ILeader) {
    return score.map((team) => ({
      ...team,
      efficiency: ((team.totalPoints / (team.totalGames * 3)) * 100).toFixed(2),
    }));
  }

  private static toRank(unranked: ILeader): ILeader {
    return unranked.sort((a, b) => b.totalPoints - a.totalPoints
    || b.totalVictories - a.totalVictories
    || b.goalsBalance - a.goalsBalance
    || b.goalsFavor - a.goalsFavor
    || b.goalsOwn - a.goalsOwn);
  }
}
