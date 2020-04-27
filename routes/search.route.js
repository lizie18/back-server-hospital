const express = require('express');
const { generalSearching, specificSearching } = require('../controllers/search.controller')

const Router = express.Router();



Router.get('/general/:term', generalSearching);
Router.get('/specific/:table/:term', specificSearching)

module.exports = Router;
