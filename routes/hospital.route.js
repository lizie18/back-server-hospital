var express = require('express');
var mdAuth = require('../middlewares/auth');
const { getHospitals } = require('../controllers/hospital.constroller')
var Hospital = require('../models/hospital.model');

var app = express();

// =======================================================================
// Obtener lista de hospitales
// =======================================================================

app.get('/', getHospitals);

// =======================================================================
// Crear nuevo hospital
// =======================================================================
app.post("/", mdAuth.verifyToken, (req, res) => {
  var body = req.body;
  var hospital = new Hospital({
    name: body.name,
    user: req.user._id,
  });

  hospital.save((err, hospitalSaved) => {
    if (err) {
      return res.status(400).json({
        ok: true,
        message: "Error al intentar crear hospital",
        err,
      });
    }
    res.status(200).json({
      ok: true,
      message: "Hospital creado correctamente",
      hospitalSaved
    });
  });
});

// =======================================================================
// Actualizar hospital
// =======================================================================

app.put('/:id', mdAuth.verifyToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;
    Hospital.findById(id, (err, hospital) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar hospital',
                err
            })
        }
        if (!hospital) {
            return res.status(400).json({
                ok: false,
                message: 'No se encontró hospital con el ID: ' + id,
                error: { message: 'No existe hostpital con ese ID' }
            })
        }

        hospital.name = body.name;
        hospital.user = req.user._id;

        hospital.save((err, hospitalSaved) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error al intentar actualizar hospital ID' + id,
                    err
                })
            }

            res.status(200).json({
                ok: true,
                message: 'Los datos del hospital fueron actualizados correctamente',
                hospitalSaved
            })
        })
    })
});

// =======================================================================
// Elimiar hospital
// =======================================================================
app.delete('/:id', mdAuth.verifyToken, (req, res)=>{
    var id = req.params.id;
    Hospital.findByIdAndRemove(id, (err, removedHospital) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: "No se puedo eliminar el hospital",
                err: { message: "No se puedo eliminar el hospital" },
            });
        }

        if (!removedHospital) {
            return res.status(400).json({
                ok: false,
                message: "Hospital no existe",
                err: { message: "Hospital no existe" },
            });
        }

        res.status(202).json({
            ok: true,
            message: `Hospital ${id} eliminado correctamente`,
            removedHospital
        })
    })
})

module.exports = app;
