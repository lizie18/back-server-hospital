const mongoose = require('mongoose');
const Hospital = require('../models/hospital.model');
const { validationHospitalData } = require('../validation/hospital');

// =======================================================================
// Obtener lista de hospitales
// =======================================================================
const getHospitals = async (req, res, next) => {
	let from = req.query.from || 0;
	from = Number(from);
	try {
		const hospitalsList = await Hospital.find({}).populate('user', 'name email').skip(from).limit(5);
		const totalHospitals = await Hospital.countDocuments();
		const shownHospitals = hospitalsList.length;
		res.send({ hospitalsList, shownHospitals: shownHospitals, totalHospitals: totalHospitals });
	} catch (error) {
		next(error)
	}
}

// =======================================================================
// Crear nuevo hospital
// =======================================================================
const createHospital = async (req, res, next) => {
	const body = req.body;
	const { error } = await validationHospitalData(body);
	if (error) return next({ message: error.details[0].message, status: 400 });

	const hospital = new Hospital({
		name: body.name,
		user: req.user._id,
	});

	try {
		const hospitalSaved = await hospital.save();
		res.status(201).send(hospitalSaved);
	} catch (error) {
		next({message: error.message, status: 400})
	}
}

// =======================================================================
// Actualizar hospital
// =======================================================================
const updateHospital = async (req, res, next) => {
	const id = req.params.id;
	const body = req.body;

	// Validar si ID es válido y si existe en la BD
	if (!mongoose.Types.ObjectId.isValid(id)) return next({ message: 'ID inválido.', status: 400 });
	const hospitalToUpdate = await Hospital.findOne({ _id: id });
	if (!hospitalToUpdate) return next({ message: `No existe hospital con ID ${id}`, status: 400 })

	// Validar la data recibida
	const { error } = validationHospitalData(body);
	if (error) return next({ message: error.details[0].message, status: 400 });

	hospitalToUpdate.name = body.name;
	hospitalToUpdate.user = req.user._id;

	try {
		const updatedHospital = await hospitalToUpdate.save();
		res.send({ hospitalUpdated: updatedHospital._id })
	} catch (error) {
		next({ message: error.message, status: 400 })
	}
}

// =======================================================================
// Eliminar hospital
// =======================================================================
const deleteHospital = async (req, res, next) => {
	const id = req.params.id;
	if (!mongoose.Types.ObjectId.isValid(id)) return next({ message: 'ID inválido.', status: 400 });
	try {
		const deletedHospital = await Hospital.findByIdAndRemove(id);
		if (!deletedHospital) return next({ message: `No existe hospital con ID ${id}`, status: 400 })
		res.send({ deletedHospital: deletedHospital._id })
	} catch (error) {
		next(error)
	}
}

module.exports.getHospitals = getHospitals;
module.exports.createHospital = createHospital;
module.exports.updateHospital = updateHospital;
module.exports.deleteHospital = deleteHospital;
