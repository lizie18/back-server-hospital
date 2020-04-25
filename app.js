// Cargar dependencias
const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const dotenv = require('dotenv')
const bodyParser = require('body-parser');

// Environment
dotenv.config();

// Importación de rutas
const apiRouter = require("./routes/app.route");

const app = express();
const port = process.env.NODE_ENV || 3000;

// Middlewares
app.use(logger('dev'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Rutas
app.use("/api", apiRouter);

app.use((req, res, next) => {
	const err = new Error('Not found');
	err.status = 404;
	console.log('Desde 404');

	next(err);
})

app.use((err, req, res, next) => {
	// console.log('error desde app.js');
	res.status(err.status || 500);

	res.send({
		error: {
			status: err.status || 500,
			message: err.message
		}
	})
})

// Escuchar puerto
app.listen(port, () => {
	console.log(`Express server puerto ${port} : \x1b[32m%s\x1b[0m`, 'online');
});


// Conexión a la BD
mongoose.connect(
	process.env.DB_CONNECT,
	{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
	(err) => {
		if (err) {
			console.log("\x1b[31m%s\x1b[0m", "DB - Error de conexión: ");
			throw err;
		}
		console.log("Base de datos: \x1b[32m%s\x1b[0m", "online");
	}
);
