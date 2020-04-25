var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var hospitalSchema = new Schema({
    name: { type: String, required: [ true, 'El nombre es obligatorio'] },
    img: { type: String, required: false },
    user: {type: Schema.Types.ObjectId, ref: 'User', required: [true, 'El usuario es obligatorio,']}
}, { collection: 'hospitals' });

module.exports = mongoose.model('Hospital', hospitalSchema);