var mongoose = require('mongoose'),

//Dirs collection
usuario = new mongoose.Schema({
  nombres:     { type: String },
  apellidos:   { type: String },
  telefono:    { type: String },
  foto:        { type: String },
  correo:      { type: String },
  contrasena:  { type: String },
  rol:  	   { type: String }
});

module.exports = mongoose.model('usuario',usuario);