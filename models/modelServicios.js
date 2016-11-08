var mongoose = require('mongoose'),

//User collection
servicios = new mongoose.Schema({
  nombreServicio:     { type: String },
  descripcionServicio:{ type: String },
  valor:         	  { type: String },
  ubicacion:          { type: String },
  estadoServicio:     { type: String },
  duracion:     	  { type: String },
  usuarioSolicita:    { type: String },
  usuarioQueRealiza:  { type: String },
  fecha:  			  { type: String }
});

module.exports = mongoose.model('servicios',servicios);
