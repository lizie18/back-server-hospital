const Joi = require('@hapi/joi');

const validationHospitalData = data => {
	const schema = Joi.object().keys({
		name: Joi.string().min(8).max(500).required()
	});
	const result = schema.validate(data);
	return result;
}

module.exports.validationHospitalData = validationHospitalData;
