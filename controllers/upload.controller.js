const fs = require('fs');

// Models
const User = require('../models/user.model');
const Doctor = require("../models/doctor.model");
const Hospital = require("../models/hospital.model");

// =======================================================================
// Generar número random de 3 cifras
// =======================================================================
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

// =======================================================================
// Eliminar imagen anterior y guardar cambios.
// =======================================================================
async function deletePrevImgAndSave(type, nameTable, id, fileName, res, next) {
	let item;
	// Item es el usuario, médico u hospital que va a recibir la imagen.
	switch (type) {
		case 'users':
			item = await User.findById(id);
			break;
		case 'doctors':
			item = await Doctor.findById(id);
			break;
		case 'hospitals':
			item = await Hospital.findById(id);
			break;
		default:
			break;
	}

	if (!item) return next({message: `NO existe ${nameTable} con ID ${id}`});

	const pathPreviousImg = `./uploads/users/${item.img}`;

	try {
		if (fs.existsSync(pathPreviousImg)) {
			fs.unlink(pathPreviousImg, err => {
				if (err) return next(err)
			});
		}
		item.img = fileName;
		item.save();
		res.send({id: item._id, message: 'Imagen subida correctamente'})
	} catch (error) {
		next(error)
	}
}

// =======================================================================
// Subir imagen a una ruta dependiendo del tipo de tabla
// =======================================================================
const uploadImg = (req, res, next) => {
	const id = req.params.id;
	const type = req.params.type;
	const nameTable = req.params.nameTable;

	const validTypes = ['hospitals', 'doctors', 'users']
	if (validTypes.indexOf(type) < 0) return next({ message: 'La tabla indicada no es válida', status: 400 });

	if (!req.files) return next({ message: 'No ha seleccionado una imagen', status: 400 });

	// Obtener nombre del archivo
	const fileImg = req.files.img;
	const nameImgCuted = fileImg.name.split('.');
	const fileExtension = nameImgCuted[nameImgCuted.length - 1];

	// Extensiones válidas
	const validExtension = ['png', 'jpg', 'jpeg', 'gif'];

	if (validExtension.indexOf(fileExtension) < 0) {
		return next({ message: `Archivo no válido. Sólo se reciben imagenes ${validExtension.join(', ')}`, status: 400})
	}

	// Generar nombre personalizado para el archivo
	const fileName = `${id}-${getRandomInt(100, 999)}.${fileExtension}`;

	// Mover imagen a determinado path
	const path = `./uploads/${type}/${fileName}`;
	fileImg.mv(path, err => {
		if (err) return next(err)
		deletePrevImgAndSave(type, nameTable,id, fileName, res, next);
	})

}

module.exports.uploadImg = uploadImg;
