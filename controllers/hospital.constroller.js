const express = require('express');
const Hospital = require('../models/hospital.model');


// =======================================================================
// Obtener lista de hospitales
// =======================================================================

const getHospitals = (req, res, next) => {
	const from = req.query.from || 0;
	from = Number(from);
	try {
		const hospitalsList = Hospital.find({}).populate('user', 'name email').skip(from).limit(5);
		res.send(hospitalsList);
	} catch (error) {
		next(error)
	}

	// Hospital.find({})
	// 	.populate('user', 'name email')
	// 	.skip(from)
	// 	.limit(5)
	// 	.exec(
	// 		(err, hospitals) => {
	// 			if (err) {
	// 				return res.status(500).json({
	// 					ok: false,
	// 					message: "Error en consulta",
	// 					err,
	// 				});
	// 			}
	// 			Hospital.count({}, (err, totalHospitals) => {
	// 				res.status(200).json({
	// 					ok: true,
	// 					hospitals,
	// 					total: totalHospitals
	// 				});
	// 			})
	// 		}
	// 	);
}

module.exports.getHospitals = getHospitals;
