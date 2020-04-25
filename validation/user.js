const Joi = require('@hapi/joi');

// Validación para crear usuario
const validationToCreate = data => {
	const schema = Joi.object().keys({
		name: Joi.string().min(3).max(200).required(),
		email: Joi.string().email().lowercase().required(),
		password: Joi.string().min(6).required(),
		role: Joi.string()
	});
	const result = schema.validate(data);
	return result
}

const validationToUpdate = data => {
	const schema = Joi.object().keys({
		name: Joi.string().min(3).max(200).required(),
		email: Joi.string().email().lowercase().required(),
		role: Joi.string().required()
	});
	const result = schema.validate(data);
	return result
}


module.exports.validationToCreate = validationToCreate;
module.exports.validationToUpdate = validationToUpdate;
