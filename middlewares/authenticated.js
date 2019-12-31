'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret="clave-secreta-para-generar-el-token-09999";

exports.authenticated = function(req, res,next){

	//comprobar si nos llega autorizacion
	if(!req.headers.authorization){
		return res.status(403).send({
			message: "La peticion no tiene la cabecera de autorization"
		});
	}

	//limpiar el tocken y quitar comillas
	var token = req.headers.authorization.replace(/['"]+/g, '');

	//decodificar el tocken
	try{
		var payload =jwt.decode(token,secret);

		//comprobar si el token ha expirado
		if(payload.exp <= moment().unix()){
			return res.status(404).send({
				message: "El token ha expirado"
			});			
		}
	

	}catch(ex){
		console.log(ex);
		return res.status(404).send({
			message: "El token no es valido"
		});
	}

	//Adjuntar usuario identificado a la request
	req.user = payload;	

	//pasar a la accion
	next();
}