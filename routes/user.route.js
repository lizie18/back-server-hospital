const express = require('express');
const Router = express.Router();
const { verifyToken } = require('../middlewares/auth');
const { getUsersList, createUser, updateUser, deleteUser } = require('../controllers/user.controller')



Router.get('/', getUsersList);

Router.post('/', verifyToken, createUser);

Router.put('/:id', verifyToken, updateUser);

Router.delete('/:id', verifyToken, deleteUser);


module.exports = Router;
