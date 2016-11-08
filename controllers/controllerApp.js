var mongoose  =  require('mongoose');
var ObjectId  = mongoose.Schema.ObjectId;
var jwt       =  require('jwt-simple');
var moment    =  require('moment');
var qs        =  require('querystring');
var service   =  require('../public/helpers/services');
var config    =  require('../public/secret.json');
var request   =  require('request');
var usuario =   mongoose.model('usuario');
var mascotas =  mongoose.model('mascotas');
var servicios = mongoose.model('servicios');
//Boxo - New App
//GET - Return all usersBD in the DB (The colection of users)

exports.traerMascotas = function(req, res) {
  var query = mascotas.find()
      query.where(req.body.key,req.body.value);
      query.exec(function(err,result){
      if(err) { return res.status(500).send(err.message); }
        return res.status(200).send({infoP: result, info: "Información"});
    });
};

exports.traerServicios = function(req, res) {
  var query = servicios.find()
      query.where(req.body.key,req.body.value);
      query.exec(function(err,result){
      if(err) { return res.status(500).send(err.message); }
        return res.status(200).send({infoP: result, info: "Información"});
    });
};

//POST - Insert a new user in the Collection
exports.registrarUsuario = function(req, res) {    
    var newUser = new usuario({
      nombres:     req.body.nombre,
      apellidos:   req.body.apellido,
      telefono:    req.body.telefono,
      foto:        "1",
      correo:      req.body.correo,
      contrasena:  req.body.contrasena,
      rol:         "usuario"
    });
    newUser.save(function(err, newUser) {
        if(err) { return res.status(500).send(err.message); }
           return res.status(200).send({token: service.createToken(newUser), infoP: newUser, info: "Usuario creado correctamente"});
    });
};

exports.registrarMascota = function(req, res) {
  /* Estados de mascota:
    enEspera
    Adoptado */
  var pets = new mascotas ({ 
    nombre:              "mascota",
    raza:                req.body.raza,
    ubicacion :          req.body.ubicacion,
    detalles:            req.body.descripcion, 
    contacto:            "",
    tipoMascota:         req.body.mascota,
    estadoMascota:       "enEspera",
    idPersonaQueAdopta:  "",
    foto:                "req.body.imgURI"  
  });
  pets.save(function(err, newPet) {
        if(err) { return res.status(500).send(err.message); }
           return res.status(200).send({info: "Mascota agregada correctamente",infoP: newPet});
  });
}

exports.solicitarServicio = function(req, res){
  /*Tipos de servicio
    enEspera
    aceptado
  */
 var d = new Date().toISOString().slice(0,10); 
 var nServicio = new servicios({
  nombreServicio:      req.body.servicio,
  descripcionServicio: req.body.descripcion,
  valor:               req.body.precio,
  ubicacion:           req.body.ubicacion,
  estadoServicio:      "enEspera",
  duracion:            req.body.tiempo,
  usuarioSolicita:     req.body.usuarioSolicita,
  usuarioQueRealiza:   "",
  fecha:               d
 });
 nServicio.save(function(err,servicio){
  if(err) { return res.status(500).send(err.message); }
           return res.status(200).send({info: "Tu servicio ha sido cargado, enbreve nos comunicaremos con usted."});
 })
}

exports.deleteUser = function(req, res) {
        BoxoUsers.findById(req.params.id, function(err, boxoUser) {
        boxoDb.remove(function(err) {
        if(err)
          //  return res.status(500).send(err.message);
      	res.status(200).send({token: service.createToken(boxoUser)});
        })
    });
};

//GET - Return a user for login
exports.iniciarSesion = function(req, res) {
    usuario.findOne({correo : req.body.usuario}, function(err, user) {
    if(err) {
      return res.status(500).send({info: 'Usuario no válido, intente de nuevo'});
    } else {
      if (user !== null) {
        if (user.contrasena === req.body.contrasena){
          return res.status(200).send({token: service.createToken(user), infoP: user, info: "Bienvenid@"})
        } else {
          return res.status(404).send({info: "Contraseña incorrecta, intente de nuevo"}); 
        }
      } else {
        return res.status(404).send({info: "El usuario no existe"});
      }
    }
    });
};

exports.userAvailable = function (req, res) {
 BoxoUsers.findOne({dbB_nickname: req.body.username}, function (err, available){
  if (err) { return res.status(500).send("No se pudo realizar la consulta") }
    if (available !== null && available.dbB_nickname.length > 3){
      return res.status(201).send("Usuario en uso");
    } else { return res.status(200).send("Usuario disponible") }
 });
}


function createJWT(userId) {
  var payload = {
    sub: userId,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
  };
  return jwt.encode(payload, config.TOKEN_SECRET);
}

decryptFile = function(user){
  var token = user.split(" ")[0];
  var user = jwt.decode(token, config.TOKEN_SECRET);
  return user;
}

exports.userAccount = function(req,res){
  var user = decryptFile(req.body.userId);
  BoxoUsers.findOne({_id: user.sub}, function (err, information){
  if (err) { return res.status(500).send("No se pudo realizar la consulta") }
  return res.status(200).send(information);
  });
}

exports.getCalifications = function(req, res){
  var fill = [];
   var user = decryptFile(req.body.userId);
    califications.find().exec(function(err,bn){

  for(var i = 0; i < bn.length; i++){
    if(bn[i].dbB_usercalifiq == user.sub){
  	fill.push(bn[i]);
    }
  }
  return res.status(200).send(fill);
})


/*califications.find({"dbB_usercalifiq" : ObjectId(user.sub)}, function (err, information){
  if (err) { return res.status(500).end("No se pudo realizar la consulta") }  
 console.log(information);
return res.status(200).send(information);
  });
*/
}

exports.updatePass = function(req, res){
    BoxoUsers.update({_id: req.body.id},{ $set: { 'dbB_password': req.body.password}}).exec(function(err, data){
    res.status(200).end("Contraseña cambiada correctamente");
  });
}

exports.updatePhoto = function(req, res){
      BoxoUsers.update({_id: req.body.user},{ $set:  { 'dbB_photo': req.body.photo }}).exec(function(err,data){
      res.send(200).end("¡Imagen cambiada correctamente!");
    })
}

exports.logout = function(req, res){
  console.log(req.body.status);
  	if(req.body.status == 1){
  		BoxoUsers.update({_id: req.body.id},{ $set:  { 'dbB_tokenDevice': "" }}).exec();
  	} else {
       		BoxoUsers.update({_id: req.body.id},{ $set:  { 'dbB_tokenDevice': req.body.token }}).exec();
   	}
}
