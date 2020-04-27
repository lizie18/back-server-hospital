const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema;

const hospitalSchema = new Schema({
    name: { type: String, unique: true, required: [ true, 'El nombre es obligatorio'] },
    img: { type: String, required: false },
    user: {type: Schema.Types.ObjectId, ref: 'User', required: [true, 'El usuario es obligatorio,']}
}, { collection: 'hospitals' });

hospitalSchema.plugin(uniqueValidator, { message: ' El {PATH} ingresado ya fue registrado anteriormente.' })

module.exports = mongoose.model('Hospital', hospitalSchema);
