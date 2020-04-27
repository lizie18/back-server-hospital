const express = require('express');
const mdAuth = require('../middlewares/auth');
const { getHospitals, createHospital, updateHospital, deleteHospital } = require('../controllers/hospital.constroller')

const Router = express.Router();

Router.get('/', getHospitals);
Router.post("/", mdAuth.verifyToken, createHospital);
Router.put('/:id', mdAuth.verifyToken, updateHospital);
Router.delete('/:id', mdAuth.verifyToken, deleteHospital)

module.exports = Router;
