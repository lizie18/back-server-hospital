var express = require("express");
var Doctor = require("../models/doctor.model");
var mdAuth = require("../middlewares/auth");

var app = express();

// =======================================================================
// Obtener lista de médicos
// =======================================================================

app.get("/", (req, res) => {
  var from = req.query.from || 0;
  from = Number(from);
  Doctor.find({})
  .populate('user', 'name email')
  .populate('hospital')
  .skip(from)
  .limit(5)
  .exec(
     (err, doctors) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          message: "Error en consulta",
          err,
        });
      }

      Doctor.count({}, (err, totalDoctors) => {
        res.status(200).json({
          ok: true,
          doctors,
          total: totalDoctors
        });
      })
  });
});

// =======================================================================
// Crear nuevo médico
// =======================================================================
app.post("/", mdAuth.verifyToken, (req, res) => {
  var body = req.body;
  var doctor = new Doctor({
    name: body.name,
    user: req.user._id,
    hospital: body.hospital
  });

  doctor.save((err, doctorSaved) => {
    if (err) {
      return res.status(400).json({
        ok: true,
        message: "Error al intentar crear médico",
        err,
      });
    }
    res.status(200).json({
      ok: true,
      message: "Médico creado correctamente",
      doctorSaved,
    });
  });
});

// =======================================================================
// Actualizar médico
// =======================================================================

app.put("/:id", mdAuth.verifyToken, (req, res) => {
  var id = req.params.id;
  var body = req.body;
  Doctor.findById(id, (err, doctor) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Error al buscar doctor",
        err,
      });
    }
    if (!doctor) {
      return res.status(400).json({
        ok: false,
        message: "No se encontró doctor con el ID: " + id,
        error: { message: "No existe hostpital con ese ID" },
      });
    }

    doctor.name = body.name;
    doctor.user = req.user._id;
    doctor.hospital = body.hospital;

    doctor.save((err, doctorSaved) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          message: "Error al intentar actualizar doctor ID" + id,
          err,
        });
      }

      res.status(200).json({
        ok: true,
        message: "Los datos del doctor fueron actualizados correctamente",
        doctorSaved
      });
    });
  });
});

// =======================================================================
// Elimiar doctor
// =======================================================================
app.delete("/:id", mdAuth.verifyToken, (req, res) => {
  var id = req.params.id;
  Doctor.findByIdAndRemove(id, (err, removedDoctor) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        message: "No se puedo eliminar el doctor",
        err: { message: "No se puedo eliminar el doctor" },
      });
    }

    if (!removedDoctor) {
      return res.status(400).json({
        ok: false,
        message: "Médico no existe",
        err: { message: "Médico no existe" },
      });
    }

    res.status(202).json({
      ok: true,
      message: `Médico ${id} eliminado correctamente`,
      removedDoctor
    });
  });
});

module.exports = app;
