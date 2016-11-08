var mongoose = require('mongoose');
var boxoRequestCntr = mongoose.model('boxorequest');
var califications = mongoose.model('califications');
var jwt = require('jwt-simple');
var config = require('../public/helpers/config');
var notificacion = require('./controllerNotifications');
var user = mongoose.model('boxousers');

/*
3 estados para boxo:
Abierta -- Que se acaba de crear
En proceso -- Ya la esta llevando el boxomensajero
Entregado -- Se entrego a su emisor
Cancelado - Pedido cancelado por el usuario
*/
exports.saveBoxoRequest = function (req, res) {
	var user = decryptFile(req.body.clientId);
	var requestBoxo = new boxoRequestCntr({
		dbB_locationPackage: 	req.body.data.currentAddress,
		dbB_addLocationPackage: req.body.data.aditioncurrentAddress,
		dbB_destinPackage : 	req.body.data.sentAddress,
		dbB_addDestinPackage:  	req.body.data.aditionSentAddress,
		dbB_mount: 				req.body.data.price,
		dbB_distancekey:  		req.body.data.distance,
		dbB_commentsSend: 		req.body.data.comments,
		dbB_userRequest:  		user.sub,
		dbB_userBringPackage:   "",
		dbB_paqueteLng: 		req.body.data.paqueteLng,
		dbB_paqueteLat: 		req.body.data.paqueteLat,
		dbB_destinoLat: 		req.body.data.destinoLat,
		dbB_destinoLng: 		req.body.data.destinoLng,
		dbB_orderStatus:  		"Abierta",
		dbB_dateTime:  			req.body.data.dateTime,
		dbB_weight:  			req.body.data.weight,
		dbB_commentsMensjero:   "",
		dbB_dateTimeDeliveredPackage:  ""
	})
	requestBoxo.save(function(err, reqBoxoSaved){
        if(err) { return res.status(500).send("Error al guardar la información, intente mas tarde!"+err); }
           return res.status(200).send("Su solicitud se ha guardado correctamente, en segundos un boxo mensagero se pondra en contacto con ud!");
	});
}

exports.showAllBoxoRequest = function(req, res){
	var requests = boxoRequestCntr.find({dbB_orderStatus : 'Abierta'}, function(err, boxoDb) {
    	if(err) { res.send(500, err); }
       	res.status(200).send(boxoDb);
    });
}

exports.obtainPackageInfo = function(req, res) {
	var requests = boxoRequestCntr.findOne({ _id : req.body.idPackage}, function(err, info) {
		if(err) { return res.status(500).send("Error con la información")}
			return res.status(200).send(info);
	});
}

exports.aceptTheDeal = function(req,res){
	var user = decryptFile(req.body.userToDeliver);
	boxoRequestCntr.findOne({_id: req.body.idPackage}, function(err, resp){
		if(resp.dbB_userRequest === user.sub){
			res.status(201).send("No puedes solicitar un pedido y realizar tu mismo el envío");	
		} else {
		resp.dbB_userBringPackage = user.sub;
		resp.dbB_orderStatus = "En proceso";
		resp.save(function(err){
			if(err) return res.status(500).send(err.message);
		 	res.status(200).send("En la pestaña Mis entregas realizadas tienes un chat con la persona que solicitó el envío");
		})
		getUsersToNotifi(resp,"acepto");
	}
})
}

exports.decryptFile = function(user){
	var token = user.split(" ")[0];
	var user = jwt.decode(token, config.TOKEN_SECRET);
	return user;
}

exports.deliveriesUser = function(req, res){
	var user = decryptFile(req.body.userId)
	boxoRequestCntr.find()
	.where('dbB_userBringPackage').equals(user.sub)
	.exec(deliveries);
	function deliveries(err, deliveries){
		if(err) { return res.status(500).send("Error con la información")}
		return res.status(200).send(deliveries);
	}
}

exports.sentsUser = function(req, res){
	var user = decryptFile(req.body.userId)
	boxoRequestCntr.find()
	.where('dbB_userRequest').equals(user.sub)
	.exec(deliveries);
	function deliveries(err, deliveries){
		if(err) { return res.status(500).send("Error con la información")}
		return res.status(200).send(deliveries);
	}
}

exports.cancelPackage = function(req, res){
	boxoRequestCntr.update({_id: req.body.packageId}, {$set: {dbB_orderStatus: "Cancelado"}}).exec();
	boxoRequestCntr.findOne({_id: req.body.packageId},function(err, data){
	var info = { "dbB_tokenDevice": data.dbB_userRequest,
		     "dbB_tokenDevice": data.dbB_userBringPackage
		   }
	  notificacion.sendNotificationToAll(info,4,"nada");
	})
}

exports.changeStatusPackage = function(req, res){
	var usuario = [];
	boxoRequestCntr.update({_id: req.body.packageId}, {$set: {dbB_orderStatus: req.body.status}}).exec();	
	var estado = (req.body.status == "Entregado")?5:4;
}

exports.requestComplete = function(req, res){
	boxoRequestCntr.update(
	{_id: req.body.packageId},
	{$set: {dbB_commentsMensjero: req.body.commnts, dbB_dateTimeDeliveredPackage: req.body.dateTime, dbB_orderStatus: req.body.status}}).exec();

	boxoRequestCntr.findOne({'_id': req.body.packageId},function(err, data){
	    getUsersToNotifi(data,req.body.status);
       })
	return res.status(200).send("Pedido "+ req.body.status +" correctamente")
}

var getUsersToNotifi = function(data,status){
  var  query = user.find({},'dbB_tokenDevice')
       query.where('_id').in([data.dbB_userRequest,data.dbB_userBringPackage])
       query.exec(function(err,results){
               console.log(results);
	if(status !== "acepto"){
           var estado = (status == "Cancelado")? 5 : 4;
            notificacion.sendNotificationToAll(results,estado,"nada");
	} else {
	    notificacion.sendNotificationToAll(results,2,"nada");
	}
          })
}

exports.califBoxoMens = function(req, res){
	var user = decryptFile(req.body.userId);
        boxoRequestCntr.findOne()
	.select('dbB_userBringPackage')
	.where('_id',req.body.packageId)
	.exec(function(err,result){
		var calificatns = new califications({
			dbB_usercalifiq: 	user.sub, 
			dbB_datetime: 		req.body.dateTime,
			dbB_points: 		req.body.ranking,
			dbB_comments: 		req.body.comments,
			dbB_packageId: 		req.body.packageId,
			dbB_userToCalifiq: 	result.dbB_userBringPackage	
	})
		calificatns.save(function(err, saved){
			 if(err) { return res.status(500).send("Error al guardar la información, intente mas tarde!"+err.message); }
	         return res.status(200).send("Su calificación se ha guardado correctamente.");
		})
	})
}

exports.bringAllInfo = function(req, res){
 califications.find()
	   .where("dbB_userToCalifiq", req.body.id)
	   .exec(function(err,result){
console.log(result);
		user.populate(result, {path: "dbB_usercalifiq"},function(err,results){
		return res.status(200).send(results);
	})
})
  
}
