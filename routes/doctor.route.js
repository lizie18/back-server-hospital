const express = require("express");
const mdAuth = require("../middlewares/auth");
const { getDoctors, createDoctor, updateDoctor, deleteDoctor } = require("../controllers/doctor.controller")

const Router = express.Router();

Router.get("/", getDoctors);

Router.post("/", mdAuth.verifyToken, createDoctor);

Router.put("/:id", mdAuth.verifyToken, updateDoctor);

Router.delete("/:id", mdAuth.verifyToken, deleteDoctor);

module.exports = Router;
