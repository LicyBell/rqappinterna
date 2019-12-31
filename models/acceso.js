'use strict'

var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2');

var Schema = mongoose.Schema;

var AccesoSchema = Schema({
	tipo: String,
	nombre: String,
	descripcion: String,
	paginaweb: String,
	email: String,
	usuario: String,
    clave : String,
    observaciones: String,
	date: { type: Date, default: Date.now},
	user: { type: Schema.ObjectId, ref: 'User'}    
});

//cargar paginacion
AccesoSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Acceso', AccesoSchema);

//Guarda los datos en la coleccion en mongo
//en mongoose.model la primer variable es la entidad que va a usar mongo para guardar
//lo pasa a minusculas y lo pone en plural, osea que en mongo va a guardarlo
//en una coleccion "documentacionclientes", si no la encuentra la crea