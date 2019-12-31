'use strict'

var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2');
var Schema = mongoose.Schema;

//Modelo de IPS
var IpclientSchema = Schema({
	publico: String, 
	interno: String,
	sucursal: String,
	observaciones: String,
	date: { type: Date, default: Date.now}
});
var Ipclient = mongoose.model('Ipclient', IpclientSchema);

//Modelo de FTP CLIENTES
var FtpclientSchema = Schema({
	usuario:String, 
	contrasenia: String,
	direccion: String,
	observaciones: String,
	date: { type: Date, default: Date.now}
});
var Ftpclient = mongoose.model('Ftpclient', FtpclientSchema);

//Modelo de MAILS clientes
var MailclientSchema = Schema({
	nombre:String, 
	usuario: String,
	password: String,
	observaciones: String,
	date: { type: Date, default: Date.now}
});
var Mailclient = mongoose.model('Mailclient', MailclientSchema);

//Modelo de proyectos clientes
var ProyectoclientSchema = Schema({
	nombre:String, 
	modulo: String,
	observaciones: String,
	date: { type: Date, default: Date.now}
});
var Proyectoclient = mongoose.model('Proyectoclient', ProyectoclientSchema);


//Modelo de DOCUMENTACION DE CLIENTES
var ClientdocSchema = Schema({
	cliente: String,
	razonsocial: String,
	cuit: String,
	idsistemaadmin: Number,
	ips: [IpclientSchema],
	ftps: [FtpclientSchema],
	mails: [MailclientSchema],
	proyectos: [ProyectoclientSchema],
	observaciones: String,
	date: { type: Date, default: Date.now},
	user: { type: Schema.ObjectId, ref: 'User' }

});

//cargar paginacion
ClientdocSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Clientdoc', ClientdocSchema); 
