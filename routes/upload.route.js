const express = require('express');
const fileUpdload = require('express-fileupload')
const Router = express.Router();


const { uploadImg } = require('../controllers/upload.controller')

// Default options
Router.use(fileUpdload())

Router.put('/:type/:id', uploadImg);

module.exports = Router;
