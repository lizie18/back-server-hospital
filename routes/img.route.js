const express = require('express');
const { viewImage } = require('../controllers/img.controller');

const app = express();

app.get("/:type/:img", viewImage);

module.exports = app;
