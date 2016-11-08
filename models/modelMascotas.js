var mongoose = require('mongoose'),

//User collection
mascotas = new mongoose.Schema({
  nombre:                 { type: String },
  raza:                   { type: String },
  ubicacion :             { type: String },
  detalles:               { type: String },
  contacto:               { type: String },
  tipoMascota:	          { type: String },
  estadoMascota:	      { type: String },
  idPersonaQueAdopta:	  { type: String },
  foto:	  				  { type: String }
});

module.exports = mongoose.model('mascotas',mascotas);