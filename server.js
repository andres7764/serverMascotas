//document.write();
// set up ==============================================================================
	var express  = require('express');
	var app      = express();
	var mongoose = require('mongoose');
	var morgan = require('morgan');
	var bodyParser = require('body-parser');
	var methodOverride = require('method-override');
	var argv = require('optimist').argv;
  	var http = require('http').Server(app);
	var io = require('socket.io')(http);
  	var cors = require('cors');
  // configuration ======================================================================
	//mongoose.connect('mongodb://' + argv.be_ip + ':80/boxoApp');
	mongoose.connect('mongodb://104.197.252.243/mascotasApp');
 	//app.use('/public', express.static(__dirname + '/public'));
 	app.use(cors());
 	app.use(express.static('public'));
 	//app.use(express.bodyParser({ keepExtensions: true, uploadDir: __dirname + "/public/photos" }));
 	app.use(express.static('/'));
 	app.use('/bower_components', express.static(__dirname + '/bower_components'));
	app.use(morgan('dev')); 										// log every request to the console
	app.use(bodyParser.urlencoded({ extended : true}));				// parse application/x-www-form-urlencoded
	app.use(bodyParser.json()); 									// parse application/json
	app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
	app.use(methodOverride());

//Include the models and controllers of the app =======================================
  require('./models/modelOrdenes');
  require('./models/modelUsuario');
  require('./models/modelMascotas');
  require('./models/modelProductos');
  require('./models/modelVentas');
  require('./models/modelCategorias');
  require('./models/modelServicios');

  var controllerApp = require('./controllers/controllerApp');

//var middleware = require('./public/helpers/middleware');

//Create routes by server rest API ====================================================
app.post('/iniciarSesion',     controllerApp.iniciarSesion);
app.post('/registrarUsuario',  controllerApp.registrarUsuario);
app.post('/guardarMascota',    controllerApp.registrarMascota);
app.post('/traerMascotas',     controllerApp.traerMascotas);
app.post('/solicitarServicio', controllerApp.solicitarServicio);
app.post('/traerServicios',    controllerApp.traerServicios);


// application ======================================================================
	app.get('/', function(req, res) {
		res.sendFile('index.html');
	});

  app.get('/home',function(req,res){
    res.render('home.html');
  })

// listen (start app with node server.js) ===========================================
	//http.listen(8080, argv.fe_ip);
	http.listen(8080);
	console.log("App listening on port 8080");

