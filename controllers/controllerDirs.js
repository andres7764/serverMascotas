var mongoose  =  require('mongoose');
var appDirs =  mongoose.model('appDirs');
exports.saveDirections = function(req, res) {
        if(req.body.data.tipo === "nuevaDir"){
         appDirs.findOne({dbB_lat: req.body.data.paqueteLat},function(err, response){
            if(response === null) {
                        var newDir = appDirs({
                        dbB_usuario : req.body.auth,
                        dbB_dirName : req.body.data.currentAddress,
                        dbB_lat : req.body.data.paqueteLat,
                        dbB_lng : req.body.data.paqueteLng,
                        dbB_tipo : "ubicacionPaquete"
                        })
                        newDir.save(function(err, chat) {
                        if(err) { return res.status(500).send(err.message); }
			return res.status(200).send('Dirección guardada correctamente');
                });
                }
           })
        } else {
        appDirs.findOne({dbB_lat: req.body.data.paqueteLat},function(err, response){
                if(response === null) {
                        var newDir = appDirs({
                        dbB_usuario : req.body.auth,
                        dbB_dirName : req.body.data.currentAddress,
                        dbB_lat : req.body.data.paqueteLat,
                        dbB_lng : req.body.data.paqueteLng,
                        dbB_tipo : "ubicacionPaquete"
                        })
                        newDir.save(function(err, chat) {
                        if(err) { return res.status(500).send(err.message); }
                });
                }
        })
      appDirs.findOne({dbB_lat: req.body.data.destinoLat},function(err, response){
                if(response === null) {
                        var newDir = appDirs({
                        dbB_usuario : req.body.auth,
                        dbB_dirName : req.body.data.sentAddress,
                        dbB_lat : req.body.data.destinoLat,
                        dbB_lng : req.body.data.destinoLng,
                        dbB_tipo : "ubicacionDestino"
                        })
                        newDir.save(function(err, chat) {
                        if(err) { return res.status(500).send(err.message); }
                });
                }
        })
     }
}
exports.findDirections = function(req, res){
        appDirs.find({dbB_usuario: req.body.userId},function(err, directions) {
       if(err) { return res.status(500).send(err.message); }
        return res.status(200).send(directions);
    });
}

exports.deleteDirection = function(req,res){
	appDirs.remove({_id: req.body.idDir}).exec();
	return res.status(200).send("Dirección eliminada correctamente");
}
