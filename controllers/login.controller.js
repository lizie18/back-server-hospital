const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const client = new OAuth2Client(CLIENT_ID);
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
		audience: CLIENT_ID
	});
	const payload = ticket.getPayload();
	return {
		name: payload.name,
		email: payload.email,
		img: payload.picture,
		google: true
	}
}
// =======================================================================
// Login with Google
// =======================================================================
const googleLogin = async (req, res) => {
	const token = req.body.gtoken
	const googleUser = await verify(token)
		.catch(err => {
			return res.status(400).json({
				ok: false,
				message: "El token es inválido",
				err
			});
		})

	User.findOne({ email: googleUser.email }, (err, userRegistered) => {
		if (err) {
			return res.status(500).json({
				ok: false,
				message: "Error buscando usuario",
				err
			});
		}

		if (userRegistered) {
			if (!userRegistered.google) {
				return res.status(400).json({
					ok: false,
					message: "El usuario no ha sido registrado mendiante Google Authentication",
					err: { message: "El usuario no ha sido registrado mendiante Google Authentication" },
				});
			} else {
				var token = jwt.sign({ user: userRegistered }, SEED, { expiresIn: 14400 }); // 4 horas
				res.status(200).json({
					ok: true,
					user: userRegistered,
					message: "Login correcto",
					token,
					id: userRegistered._id,
				});
			}
		} else {
			const user = new User();
			user.name = googleUser.name;
			user.email = googleUser.email;
			user.img = googleUser.img;
			user.google = true;
			user.password = ':)'

			user.save((err, userSaved) => {
				if (err) {
					return res.status(400).json({
						ok: false,
						message: "No se pudo guardar el usuario",
						googleUser,
						user,
						err,
					});
				}
				var token = jwt.sign({ user: userSaved }, SEED, { expiresIn: 14400 }); // 4 horas
				res.status(200).json({
					ok: true,
					user: userSaved,
					message: "Usuario creado y Login correcto",
					token,
					id: userSaved._id,
				});
			})
		}
	});
}




module.exports.login = login;
module.exports.googleLogin = googleLogin;
