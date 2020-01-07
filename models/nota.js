'use strict'

var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2');
var Schema = mongoose.Schema;

//Modelo de TOPIX
var NotaSchema = Schema({
	titulo: String,
	web: String,
	tema: String,
	contenido: String,
	date: { type: Date, default: Date.now},
	user: { type: Schema.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Nota', NotaSchema); 
