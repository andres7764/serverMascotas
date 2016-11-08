var mongoose = require('mongoose'),

//RequestBoxo collection
ventas = new mongoose.Schema({
  usuario:                 { type: String },
  producto:                { type: String },
  cantidad:                { type: String },
  valorUnitario:           { type: String },
  valorTotal:              { type: String },
  estadp:                  { type: String }
});

module.exports = mongoose.model('ventas',ventas);