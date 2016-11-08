var mongoose = require("mongoose"),

ordenesServicio = new mongoose.Schema({
	tipoServicio:   { type: String },
	cantidadHoras: 	{ type: String },
	valorServicio: 	{ type: String },
	idUsuario: 		{ type: String },
	idTrabajador:   { type: String },
	comentarios: 	{ type: String }
})

module.exports = mongoose.model('ordenesdeservicio', ordenesServicio);