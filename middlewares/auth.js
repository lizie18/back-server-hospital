var jwt = require('jsonwebtoken');

exports.verifyToken = async (req, res, next) => {
	var token = await req.headers.authorization;

	if (!token) {
		next({message: 'No se proporcionado la autenticación requerida.', status: 401})
	}

	try {
		const verified = await jwt.verify(token, process.env.SEED_TOKEN);
		req.user = verified.user;
	} catch (error) {
		next({message: 'Token incorrecto.', status: 401})
	}
	next();
}
