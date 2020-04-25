const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const User = require('../models/user.model')
const { validationToCreate, validationToUpdate} = require('../validation/user')

// =======================================================================
// Obtener lista de usuarios
// =======================================================================
const getUsersList = async (req, res, next) => {
	let from = req.query.from || 0;
	from = Number(from);
	try {
		const usersList = await User.find({}, 'name email img role').skip(from).limit(10);
		const shownUsers = usersList.length;
		const totalUsers = await User.countDocuments();
		res.send({ usersList, shownUsers: shownUsers, totalUsers: totalUsers });
	} catch (err) {
		next(err)
	}
}

// =======================================================================
// Crear usuario
// =======================================================================
const createUser = async (req, res, next) => {
	const body = req.body;
	const { error } = validationToCreate(body);
	if (error) next({ message: error.details[0].message, status: 400 });

	const user = new User({
		name: body.name,
		email: body.email,
		password: await bcryptjs.hashSync(body.password, 10),
		role: body.role,
	});

	try {
		const userSaved = await user.save();
		res.status(201).send({user: userSaved._id});
	} catch (error) {
		error.status = 400;
		// // err.message = err.errors
		next(error)
		// res.status(400).send(err)
	}
}

// =======================================================================
// Actualizar usuario
// =======================================================================
const updateUser = async (req, res, next) => {
	const id = req.params.id;
	const body = req.body;

	// Validar si ID es válido y si existe en la BD
	if (!mongoose.Types.ObjectId.isValid(id)) next({message:'ID inválido.', status: 400});
	const userToUpdate = await User.findOne({_id: id});
	if (!userToUpdate) next({message: `No existe usuario con ID ${id}`, status: 400 })

	// Validar la data recibida
	const { error } = validationToUpdate(body);
	if (error) next({ message: error.details[0].message, status: 400 });

	userToUpdate.name = body.name;
	userToUpdate.email = body.email;
	userToUpdate.role = body.role;

	try {
		const updatedUser = await userToUpdate.save();
		res.send({ userUpdated: updatedUser._id })
	} catch(error) {
		error.status = 400;
		next(error)
	}
}

// =======================================================================
// Elimiar usuario
// =======================================================================
const deleteUser = async (req, res, next) => {
	const id = req.params.id;
	if (!mongoose.Types.ObjectId.isValid(id)) next({ message: 'ID inválido.', status: 400 });
	try {
		const deletedUser = await User.findByIdAndRemove(id);
		if (!deletedUser) next({ message: `No existe usuario con ID ${id}`, status: 400 })
		res.send({userDeleted: deletedUser._id})
	} catch (error) {
		next(error)
	}
}

module.exports.getUsersList = getUsersList;
module.exports.createUser = createUser;
module.exports.updateUser = updateUser;
module.exports.deleteUser = deleteUser;
