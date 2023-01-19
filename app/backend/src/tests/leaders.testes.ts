// import * as sinon from 'sinon'; 
// import * as chai from 'chai'; 
// import sequelize from '../database/models';

// // @ts-ignore
// import chaiHttp = require('chai-http');

// import { app } from '../app'; 
// import { describe } from 'mocha';
// import LeaderboardService from '../services/leadersBoardService';
// import { adminUser, scoreBoard, arrayTeams, matches, token } from './mocks/matchesMock';

// import { Request, Response as Resp, NextFunction } from 'express';
// import verifyToken from '../midwares/token';

// chai.use(chaiHttp);

// const { expect } = chai;

// describe('GET /leaderboard/home', () => {
//   beforeEach(() => {
//     let x: string = 'x';
//     sinon.stub(sequelize, 'query').resolves([scoreBoard, x] as unknown as [any, string]);
//     sinon.stub(LeaderboardService, 'getLeaderboardHome').resolves(scoreBoard);
//   });

//   afterEach(() => { sinon.restore(); });

//   it('should return a 200 status code', async () => {
//     const response = await chai.request(app).get('/leaderboard/home');
//     expect(response).to.be.status(200);
//   });

//   it('should return a valid leaderboard', async () => {
//     const response = await chai.request(app).get('/leaderboard/home');
//     expect(response.body).to.be.eql(scoreBoard);
//   });
// });

// describe('GET /leaderboard/away', () => {
//   beforeEach(() => {
//     let x: string = 'x';
//     sinon.stub(sequelize, 'query').resolves([scoreBoard, x] as unknown as [any, string]);
//     sinon.stub(LeaderboardService, 'getLeaderboardAway').resolves(scoreBoard);
//   });

//   afterEach(() => { sinon.restore(); });

//   it('should return a 200 status code', async () => {
//     const response = await chai.request(app).get('/leaderboard/away');
//     expect(response).to.be.status(200);
//   });

//   it('should return a valid leaderboard', async () => {
//     const response = await chai.request(app).get('/leaderboard/away');
//     expect(response.body).to.be.eql(scoreBoard);
//   });
// });
