const Joi = require('@hapi/joi');

const validateDoctorData = data => {
	const schema = Joi.object().keys({
		name: Joi.string().min(3).required(),
		hospital: Joi.string().required()
	});
	const result = schema.validate(data);
	return result
}

module.exports.validateDoctorData = validateDoctorData;
