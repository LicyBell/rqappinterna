'use strict'

//requires (cargar librerias)
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

//ejecutar expressacce
var app = express();

//cargar archivos de rutas
var user_routes = require('./routes/user');
var acceso_routes = require('./routes/acceso');
var clientdoc_routes = require('./routes/clientdoc');
var topic_routes = require('./routes/topic');
var coment_routes = require('./routes/coment');
var ipclient_routes = require('./routes/ipclient');
var ftpclient_routes = require('./routes/ftpclient');
var mailclient_routes = require('./routes/mailclient');
var proyectoclient_routes = require('./routes/proyectoclient');


//middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


//Reescribir rutas
app.use('/', express.static('client',{redirect: false}));

app.use('/api', user_routes);
app.use('/api', acceso_routes);
app.use('/api', clientdoc_routes);
app.use('/api', topic_routes);
app.use('/api', coment_routes);
app.use('/api', ipclient_routes);
app.use('/api', ftpclient_routes);
app.use('/api', mailclient_routes);
app.use('/api', proyectoclient_routes);

app.get('*', function(req,res,next){
	res.sendFile(path.resolve('client/index.html'));
});


//exportar el modulo
module.exports = app;
