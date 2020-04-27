const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.G_CLIENT_ID);
const User = require('../models/user.model');

// =======================================================================
// Login
// =======================================================================
const login = async (req, res, next) => {
	const body = req.body;
	try {
		const loginUser = await User.findOne({ email: body.email });
		if (!loginUser || !bcrypt.compareSync(body.password, loginUser.password)) {
			next({message: 'Correo electrónico y/o contraseña inválidos.', status: 401});
		}
		const token = jwt.sign({ user: loginUser }, process.env.SEED_TOKEN, { expiresIn: 14400 }); // 4 horas
		res.send({ user: loginUser._id, token: token})
	} catch (error) {
		next(error)
	}
}

// =======================================================================
// Verificación cuenta Google
// =======================================================================
async function verify(token) {
	const ticket = await client.verifyIdToken({
		idToken: token,
		audience: process.env.G_CLIENT_ID
	})
	const payload = ticket.getPayload();
	return {
		name: payload.name,
		email: payload.email,
		img: payload.picture,
		google: true
	}
}
// =======================================================================
// Login con Google
// =======================================================================
const googleLogin = async (req, res, next) => {
	const token = req.body.gtoken;

	// Validar cuenta google
	let googleUser = await verify(token).catch(e => { return 'Error' });
	if (googleUser === 'Error') return next({ message: 'Token incorrecto', status: 400 })

	// Validar si existe usuario en la DB
	let loginUser = await User.findOne({ email: googleUser.email });
	if (loginUser && !loginUser.google) {
		return next({ message: 'El usuario no está registrado con Google Authentication', status: 400 })
	}

	// Crear usuario
	if (!loginUser) {
		const user = new User();

		user.name = googleUser.name;
		user.email = googleUser.email;
		user.img = googleUser.img;
		user.google = true;
		user.password = ':)'

		try {
			loginUser = await user.save();
		} catch (error) {
			next({ message: error.message, status: 400 })
		}
	}
	try {
		const token = jwt.sign({ user: loginUser }, process.env.SEED_TOKEN, { expiresIn: 14400 }); // 4 horas
		res.send({ user: loginUser._id, token: token })
	} catch (error) {
		next(error)
	}
}

module.exports.login = login;
module.exports.googleLogin = googleLogin;
