const express = require('express');
const { login, googleLogin } = require('../controllers/login.controller')

const Router = express();


Router.post('/', login)

Router.post('/google', googleLogin)

module.exports = Router;
