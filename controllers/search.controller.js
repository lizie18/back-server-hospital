const Hospital = require('../models/hospital.model');
const Doctor = require('../models/doctor.model');
const User = require('../models/user.model');

// ========================================================================
// Búsqueda general
// ========================================================================
const generalSearching = (req, res, next) => {
	const searchedTerm = req.params.term
	searchedTerm = new RegExp(searchedTerm, 'i');
	Promise.all([
		searchDoctors(searchedTerm),
		searchHospitals(searchedTerm),
		searchUsers(searchedTerm)
	])
	.then(results => {
		res.send({
			ok: true,
			doctors: results[0],
			hospitals: results[1],
			users: results[2]
		})
	})
}

// ========================================================================
// Búsqueda específica
// ========================================================================
const specificSearching = (req, res, next) => {
	const table = req.params.table;
	const searchedTerm = req.params.term
	searchedTerm = new RegExp(searchedTerm, 'i');
	switch (table) {
		case 'doctors':
			promise = searchDoctors(searchedTerm)
			break;
		case 'users':
			promise = searchUsers(searchedTerm)
			break;
		case 'hospitals':
			promise = searchHospitals(searchedTerm)
			break;
		default:
			return next({ message: 'Tipo de tabla no válido', status: 400 })
	}
	promise.then(results => {
		res.send({
			ok: false,
			[table]: results
		})
	})
}


function searchHospitals(searchedTerm) {
	return new Promise((resolve, reject) => {
		Hospital.find({ name: searchedTerm })
		.populate('user', 'name email')
		.exec(
			(err, hospitals) => {
				if (err) {
					reject('Falló la búsqueda', err)
				} else {
					resolve(hospitals)
				}
			}
		)
	})
};

function searchDoctors(searchedTerm) {
	return new Promise((resolve, reject) => {
		Doctor.find({ name: searchedTerm })
		.populate('user', 'name email')
		.populate('hospital')
		.exec(
			(err, doctors) => {
				if (err) {
					reject('Falló la búsqueda', err)
				} else {
					resolve(doctors)
				}
			}
		)
	})
};

function searchUsers(searchedTerm) {
	return new Promise((resolve, reject) => {
		User.find({}, 'name email')
		.or([{ name: searchedTerm }, { email: searchedTerm }])
		.populate('user', 'name email')
		.populate('hospital')
		.exec(
			(err, doctors) => {
				if (err) {
					reject('Falló la búsqueda', err)
				} else {
					resolve(doctors)
				}
			}
		)
	})
};

module.exports.generalSearching = generalSearching;
module.exports.specificSearching = specificSearching;
