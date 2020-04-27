const express = require('express');
const Router = express.Router();

// Importación de Rutas
const userRoutes = require("./user.route");
const loginRoutes = require("./login.route");
const hospitalRoutes = require("./hospital.route");
const doctorRoutes = require("./doctor.route");
const searcherRoutes = require("./search.route");
const uploadRoutes = require("./upload.route");
const imgRoutes = require("./img.route");

// Rutas
let API_ROUTER = Router
.use("/user", userRoutes)
.use("/login", loginRoutes)
.use("/hospital", hospitalRoutes)
.use("/doctor", doctorRoutes)
.use("/search", searcherRoutes)
.use("/upload", uploadRoutes)
.use("/img", imgRoutes)

module.exports = API_ROUTER;
