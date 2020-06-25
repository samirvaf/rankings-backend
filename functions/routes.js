const { Router } = require('express');

const RankingController = require('./controllers/RankingController');

const routes = Router();

routes.get('/rankings', RankingController.index);
routes.post('/rankings', RankingController.store);

module.exports = routes;
