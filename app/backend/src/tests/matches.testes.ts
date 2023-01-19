import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { describe } from 'mocha';
import * as Sinon from 'sinon';
import { app } from '../app';
import Matches from '../database/models/Matches.model';
import Teams from '../database/models/Teams.model';
import { IMatchComplete } from '../interfaces/Interfaces';
import MatchesMock from './mocks/matchesMock';
import TeamsMock from './mocks/teamsMock';

const { expect } = chai;

chai.use(chaiHttp);

const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

describe('Test match route', () => {
  describe('GET /matches', () => {
    afterEach(Sinon.restore);
    it('should return all the matches', async () => {
      Sinon.stub(Matches, 'findAll').resolves(MatchesMock as Matches[]);
      const response = await chai.request(app)
        .get('/matches')
      expect(response).to.have.status(200);
      expect(response.body).to.be.an('array');
    });
    it('should have the team names', async () => {
      Sinon.stub(Matches, 'findAll').resolves(MatchesMock as Matches[]);
      const response = await chai.request(app)
        .get('/matches')
      response.body.forEach((match: IMatchComplete) => {
        const { teamHome, teamAway } = match;
        expect(teamHome).to.have.property('teamName');
        expect(teamAway).to.have.property('teamName');
      })
    })
  })
  describe('GET /matches?inProgress', () => {
    afterEach(Sinon.restore);
    it('should return only matches in progress if the query is true', async () => {
      Sinon.stub(Matches, 'findAll').resolves(MatchesMock.filter((match) => match.inProgress) as Matches[]);
      const response = await chai.request(app)
        .get('/matches?inProgress=true')
      expect(response).to.have.status(200);
      response.body.forEach((match: IMatchComplete) => {
        const { inProgress } = match;
        expect(inProgress).to.be.true;
      })
    })
    it('should return only finished matches if the query is false', async () => {
      Sinon.stub(Matches, 'findAll').resolves(MatchesMock.filter((match) => !match.inProgress) as Matches[]);
      const response = await chai.request(app)
        .get('/matches?inProgress=false')
      expect(response).to.have.status(200);
      response.body.forEach((match: IMatchComplete) => {
        const { inProgress } = match;
        expect(inProgress).to.be.false;
      })
    })
  })
  describe('POST /matches', () => {
    afterEach(Sinon.restore);
    let token = '';
    it('shouldn\'t be possible to create a match without a token', async () => {
      const response = await chai.request(app)
        .post('/matches')
        .send({
          "homeTeam": 16,
          "awayTeam": 8,
          "homeTeamGoals": 2,
          "awayTeamGoals": 2
        })
      expect(response).to.have.status(401);
      expect(response.body).to.have.property('message', 'Token must be a valid token');
    });
    it('shouldn\'t be possible to create a match without an invalid token', async () => {
      const response = await chai.request(app)
        .post('/matches')
        .auth(fakeToken, { type: 'bearer' })
        .send({
          "homeTeam": 16,
          "awayTeam": 8,
          "homeTeamGoals": 2,
          "awayTeamGoals": 2
        })
      expect(response).to.have.status(401);
      expect(response.body).to.have.property('message', 'Token must be a valid token');
    });
    it('should not be possible to create a match if the home and away teams are the same', async () => {
      token = await chai.request(app)
        .post('/login')
        .send({
          email: 'user@user.com',
          password: 'secret_user',
        })
        .then((res) => res.body.token)
      const response = await chai.request(app)
        .post('/matches')
        .auth(token, { type: 'bearer' })
        .send({
          "homeTeam": 8,
          "awayTeam": 8,
          "homeTeamGoals": 2,
          "awayTeamGoals": 2
        })
      expect(response).to.have.status(401);
      expect(response.body).to.have.property('message', 'It is not possible to create a match with two equal teams');
    });
    it('should not be possible to create a match if the one of the teams doesn\'t exist', async () => {
      Sinon.stub(Teams, 'findOne')
        .withArgs({ where: { id: 20 } }).resolves(undefined)
        .withArgs({ where: { id: 8 } }).resolves(TeamsMock.find((team) => team.id === 8) as unknown as Teams);
      const response = await chai.request(app)
        .post('/matches')
        .auth(token, { type: 'bearer' })
        .send({
          "homeTeam": 20,
          "awayTeam": 8,
          "homeTeamGoals": 2,
          "awayTeamGoals": 2
        })
      expect(response).to.have.status(404);
      expect(response.body).to.have.property('message', 'There is no team with such id!');
    });
    it('should be possible to create a match', async () => {
      Sinon.stub(Teams, 'findOne')
        .withArgs({ where: { id: 16 } }).resolves(TeamsMock.find((team) => team.id === 16) as unknown as Teams)
        .withArgs({ where: { id: 8 } }).resolves(TeamsMock.find((team) => team.id === 8) as unknown as Teams);
      Sinon.stub(Matches, 'create').resolves({
        id: MatchesMock.length,
        homeTeam: 16,
        awayTeam: 8,
        homeTeamGoals: 2,
        awayTeamGoals: 2,
        inProgress: true,
      } as Matches)
      const response = await chai.request(app)
        .post('/matches')
        .auth(token, { type: 'bearer' })
        .send({
          "homeTeam": 16,
          "awayTeam": 8,
          "homeTeamGoals": 2,
          "awayTeamGoals": 2
        })
      const expected = {
        "id": 48,
        "homeTeam": 16,
        "homeTeamGoals": 2,
        "awayTeam": 8,
        "awayTeamGoals": 2,
        "inProgress": true,
      }
      expect(response).to.have.status(201);
      expect(response.body).to.be.deep.equal(expected);
    });
  })
  describe('PATCH /matches/:id/finish', () => {
    afterEach(Sinon.restore);
    it('should update the inProgress key and return finished', async () => {
      Sinon.stub(Matches, 'findAll').resolves(MatchesMock.filter((match) => match.inProgress) as Matches[]);
      Sinon.stub(Matches, 'update').resolves();
      const response = await chai.request(app)
        .get('/matches?inProgress=true')
      const id = response.body[0].id;
      const res = await chai.request(app)
        .patch(`/matches/${id}/finish`);
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('message', 'Finished');
    })
  })
  describe('PATCH /matches/:id', () => {
    it('should update the scores', async () => {
      Sinon.stub(Matches, 'findAll').resolves(MatchesMock.filter((match) => match.inProgress) as Matches[]);
      Sinon.stub(Matches, 'update').resolves();
      const response = await chai.request(app)
      .get('/matches?inProgress=true')
      const id = response.body[0].id;
      const res = await chai.request(app)
        .patch(`/matches/${id}`)
        .send({
          "homeTeamGoals": 3,
          "awayTeamGoals": 1,
        });
      expect(res).to.have.status(200);
    })
  })
})