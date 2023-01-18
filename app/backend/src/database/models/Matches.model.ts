import { Model, BOOLEAN, INTEGER } from 'sequelize';
import db from '.';
import Teams from './Teams.model';

class Matches extends Model {
  id!: number;
  homeTeam!: number;
  homeTeamGoals!: number;
  awayTeam!: number;
  awayTeamGoals!: number;
  inProgress!: boolean;
}

Matches.init({
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  homeTeam: {
    type: INTEGER,
    allowNull: false,
    field: 'home_team',
  },
  homeTeamGoals: {
    type: INTEGER,
    allowNull: false,
    field: 'home_team_goals',
  },
  awayTeam: {
    type: INTEGER,
    allowNull: false,
    field: 'away_team',
  },
  awayTeamGoals: {
    field: 'away_team_goals',
    allowNull: false,
    type: INTEGER,
  },
  inProgress: {
    field: 'in_progress',
    allowNull: false,
    type: BOOLEAN,
  },
}, {
  sequelize: db,
  modelName: 'matches',
  timestamps: false,
});

Teams.belongsTo(Matches, { foreignKey: 'id', as: 'teamHome' });
Teams.belongsTo(Matches, { foreignKey: 'id', as: 'teamAway' });

Matches.hasMany(Teams, { foreignKey: 'id', as: 'teamHome' });
Matches.hasMany(Teams, { foreignKey: 'id', as: 'teamAway' });

export default Matches;
