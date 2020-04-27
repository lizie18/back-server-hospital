const mongoose = require('mongoose');
const Doctor = require('../models/doctor.model');
const { validateDoctorData } = require('../validation/doctor');

// =======================================================================
// Obtener lista de médicos
// =======================================================================
const getDoctors = async (req, res, next) => {
	let from = req.query.from || 0;
	from = Number(from);
	try {
		const doctorsList = await Doctor.find({})
		.populate('user', 'name email')
		.populate('hospital')
		.skip(from).limit(5);
		const totalDoctor = await Doctor.countDocuments();
		const shownDoctor = doctorsList.length;
		res.send({ doctorsList, shownDoctor: shownDoctor, totalDoctor: totalDoctor });
	} catch (error) {
		next(error)
	}
}

// =======================================================================
// Crear nuevo médico
// =======================================================================
const createDoctor = async (req, res, next) => {
	const body = req.body;
	const { error } = await validateDoctorData(body);
	if (error) return next({ message: error.details[0].message, status: 400 });

	const doctor = new Doctor({
		name: body.name,
		user: req.user._id,
		hospital: body.hospital
	});

	try {
		const doctorSaved = await doctor.save();
		res.status(201).send(doctorSaved);
	} catch (error) {
		next({ message: error.message, status: 400 })
	}
}

// =======================================================================
// Actualizar médico
// =======================================================================
const updateDoctor = async (req, res, next) => {
	const id = req.params.id;
	const body = req.body;

	// Validar si ID es válido y si existe en la BD
	if (!mongoose.Types.ObjectId.isValid(id)) return next({ message: 'ID inválido.', status: 400 });
	const doctorToUpdate = await Doctor.findOne({ _id: id });
	if (!doctorToUpdate) return next({ message: `No existe doctor con ID ${id}`, status: 400 })

	// Validar la data recibida
	const { error } = validateDoctorData(body);
	if (error) return next({ message: error.details[0].message, status: 400 });

	doctorToUpdate.name = body.name,
	doctorToUpdate.user = req.user._id,
	doctorToUpdate.hospital = body.hospital

	try {
		const updatedDoctor = await doctorToUpdate.save();
		res.send({ updatedDoctor: updatedDoctor._id })
	} catch (error) {
		next({ message: error.message, status: 400 })
	}
}

// =======================================================================
// Eliminar médico
// =======================================================================
const deleteDoctor= async (req, res, next) => {
	const id = req.params.id;
	if (!mongoose.Types.ObjectId.isValid(id)) return next({ message: 'ID inválido.', status: 400 });
	try {
		const deletedDoctor = await Doctor.findByIdAndRemove(id);
		if (!deletedDoctor) return next({ message: `No existe doctor con ID ${id}`, status: 400 })
		res.send({ deletedDoctor: deletedDoctor._id })
	} catch (error) {
		next(error)
	}
}

module.exports.getDoctors = getDoctors;
module.exports.createDoctor = createDoctor;
module.exports.updateDoctor = updateDoctor;
module.exports.deleteDoctor = deleteDoctor;
