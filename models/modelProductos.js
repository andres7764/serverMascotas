var mongoose = require('mongoose'),

//RequestBoxo collection
productos = new mongoose.Schema({
  nombre:            { type: String },
  precio:            { type: String },
  descripcion:       { type: String },
  cantidad:          { type: String },
  precio:            { type: String },
  categoria:	     { type: String }
});

module.exports = mongoose.model('productos',productos);
