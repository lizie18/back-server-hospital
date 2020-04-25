var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator')

var Schema = mongoose.Schema;
var validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
}

var userSchema = new Schema ({
    name: { type: String, required: [true, 'El nombre es un campo obligatorio.'] },
    email: { type: String, unique: true, required: [true, 'El correo electrónico es un campo obligatorio.'] },
    password: { type: String, required: [true, 'La contraseña es un campo obligatorio.'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: validRoles },
    google: { type: Boolean, default: false }
});


userSchema.plugin(uniqueValidator, {message: ' El {PATH} ingresado ya fue registrado anteriormente.'})

module.exports = mongoose.model('User', userSchema);
