var express = require('express');
var fileUpdload = require('express-fileupload')
var fs = require('fs');
var app = express();

// Models
var User = require('../models/user.model');
var Doctor = require("../models/doctor.model");
var Hospital = require("../models/hospital.model");


// Default options
app.use(fileUpdload())

app.put('/:type/:id', (req, res, next) => {
    var type = req.params.type;
    var id = req.params.id;

    var validTypes = ['hospitals', 'doctors', 'users']

    if (validTypes.indexOf(type) < 0) {
        return res.status(400).json({
            ok: false,
            message: "La tabla indicada no es válida",
            err: { message: "La tabla indicada no es válida" },
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            message: 'No ha seleccionado una imagen',
            err: { message: 'No ha seleccionado una imagen' }
        })
    }

    // Obtener nombre del archivo
    const fileImg = req.files.img;
    const nameImgCuted = fileImg.name.split('.')
    const fileExtension = nameImgCuted[nameImgCuted.length - 1];

    // Extensiones válidas
    const validExtension = ['png', 'jpg', 'jpeg', 'gif']

    if (validExtension.indexOf(fileExtension) < 0) {
        return res.status(400).json({
            ok: false,
            message: `El archivo seleccionado no es válido. Solo se reciben imagenes ${validExtension.join(', ')}` ,
            err: { message: `El archivo seleccionado no es válido. Solo se reciben imagenes ${validExtension.join(', ')}` }
        })
    }


    // Generar nombre personalizado para el archivo
    var fileName = `${id}-${getRandomInt(100, 999)}.${fileExtension}`;

    // Mover imagen a determinado path
    var path = `./uploads/${type}/${fileName}`;

    fileImg.mv(path, err => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error al mover archivo',
                err
            })
        }
        uploadImgByType(type, id, fileName, res);
    })

});


// Generar número random de 3 cifras
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function uploadImgByType(type, id, fileName, res) {
    switch (type) {
        case 'users':
            User.findById(id, (err, user) => {
                if (!user) {
                    return res.status(400).json({
                        ok: false,
                        message: `No existe usuario con id ${id}`,
                        err: { message: `No existe usuario con id ${id}` },
                    });
                }
                var pathPreviousImg = `./uploads/users/${user.img}`;
                if (fs.existsSync(pathPreviousImg)) {
                    fs.unlink(pathPreviousImg, err => {
                        if (err) {
                            return res.status(500).json({
                              ok: false,
                              message: "No se puedo elimina la imagen anterior",
                              err,
                            });
                        }
                    });
                }
                user.img = fileName;
                user.save((err, updatedUser) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            message: "No se pudo actualizar el usuario",
                            err,
                        });
                    }
                    updatedUser.password = ':)'
                    return res.status(200).json({
                        ok: true,
                        message: "Imagen de Usuario actualizado",
                        updatedUser,
                    });
                });
            })
            break;

        case 'doctors':
            Doctor.findById(id, (err, doctor) => {
                if (!doctor) {
                    return res.status(400).json({
                        ok: false,
                        message: `No existe médico con id ${id}`,
                        err: { message: `No existe médico con id ${id}` },
                    });
                }
                var pathPreviousImg = `./uploads/doctors/${doctor.img}`;
                if (fs.existsSync(pathPreviousImg)) {
                    fs.unlink(pathPreviousImg, err => {
                        if (err) {
                            return res.status(500).json({
                              ok: false,
                              message: "No se puedo elimina la imagen anterior",
                              err,
                            });
                        }
                    });
                }
                doctor.img = fileName;
                doctor.save((err, updatedDoctor) => {
                    if (err) {
                        return res.status(400).json({
                        ok: false,
                        message: "No se pudo actualizar el médico",
                        err,
                        });
                    }
                    return res.status(200).json({
                        ok: true,
                        message: "Imagen de médico actualizado",
                        updatedDoctor
                    });
                });
            })
            break;
        case 'hospitals':
            Hospital.findById(id, (err, hospital) => {
                if (!hospital) {
                  return res.status(400).json({
                    ok: false,
                    message: `No existe hospital con id ${id}`,
                    err: { message: `No existe hospital con id ${id}` },
                  });
                }
                var pathPreviousImg = `./uploads/hospitals/${hospital.img}`;
                if (fs.existsSync(pathPreviousImg)) {
                    fs.unlink(pathPreviousImg, err => {
                        if (err) {
                            return res.status(500).json({
                              ok: false,
                              message: "No se puedo elimina la imagen anterior",
                              err,
                            });
                        }
                    });
                }
                hospital.img = fileName;
                hospital.save((err, updatedHospital) => {
                    if (err) {
                        return res.status(400).json({
                        ok: false,
                        message: "No se pudo actualizar el hospital",
                        err,
                        });
                    }
                    return res.status(200).json({
                        ok: true,
                        message: "Imagen de hospital actualizado",
                        updatedHospital
                    });
                });
            })
            break;

        default:
            break;
    }
}

module.exports = app;
