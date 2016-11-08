var mongoose = require('mongoose'),

//User collection
categoria = new mongoose.Schema({
  nobreCategoria:     { type: String },
  categoriaPrincipal: { type: String }
});


module.exports = mongoose.model('categoria',categoria);
