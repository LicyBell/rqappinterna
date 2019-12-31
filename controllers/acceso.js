'use strict'
var validator = require('validator');
var Acceso = require('../models/acceso');

var controller = {

	test: function(req, res){
		return res.status(200).send({
			message: "soy el metodo testeando accesos"
		})
	},


	save: function(req,res){
		//recoger los parametros por post
		var params = req.body;

		//validar los datos
		try{
			//validar los datos
			var validate_tipo = !validator.isEmpty(params.tipo);
			var validate_nombre = !validator.isEmpty(params.nombre);
			var validate_clave = !validator.isEmpty(params.clave);
			//valido mail si es que lo ingresa
			if (params.email){
				var validate_email = validator.isEmail(params.email);
			}else{
				var validate_email = true;
			}

		}catch(err){
			return res.status(500).send({
				status: 'error',
				message: 'Faltan datos (Obligatorio: tipo, nombre, clave). Si ingresa mail debe ser valido.'
			});	
		}

		if (validate_clave && validate_nombre && validate_tipo && validate_email){
			//crear el objeto a guardar
			var acceso = new Acceso();

			//asignar valores
			acceso.tipo = params.tipo;
			acceso.nombre = params.nombre;
			acceso.descripcion = params.descripcion;
			acceso.paginaweb = params.paginaweb;
			acceso.email = params.email;
			acceso.usuario = params.usuario;
			acceso.clave = params.clave;
			acceso.observaciones = params.observaciones;
			acceso.user = req.user.sub;

			//guardar el acceso
			acceso.save((err, accesoStored) => {

				if(err || !accesoStored){
					return res.status(404).send({
						status: 'error',
						message: 'El Acceso no se ha guardado'
					});	
				}

				//devolver respuesta
				return res.status(200).send({
					status: 'success',
					acceso: accesoStored
				});		
			});


		}else{
			return res.status(500).send({
				status: 'error',
				message: 'Faltan datos (Obligatorio: tipo, nombre, clave). Si ingresa mail debe ser valido.'
			});	

		}
	}, // close save

	getAccesos: function(req, res){
		//find con la condicion de usuario
		Acceso.find().sort([['date','descending']]).exec((err, accesos) =>{

			if(err){
				return res.status(500).send({
					status: 'error',
					message: 'Error al hacer la consulta'
				});	
			}

			if(!accesos){
				return res.status(404).send({
					status: 'error',
					message: 'No se encontraron Accesos'
				});	
			}

			//devolver resultado
			return res.status(200).send({
				status: 'success',
				accesos
			});	


		});

	}, //close get accesos

	getAccesosByUser: function(req,res){
		//conseguir el id del usuario
		var userId = req.params.user;

		//find con la condicion de usuario
		Acceso.find({user: userId}).sort([['date','descending']]).exec((err, accesos) =>{

			if(err){
				return res.status(500).send({
					status: 'error',
					message: 'Error al hacer la consulta por usuario'
				});	
			}

			if(!accesos){
				return res.status(404).send({
					status: 'error',
					message: 'No se encontraron Accesos del usuario'
				});	
			}

			//devolver resultado
			return res.status(200).send({
				status: 'success',
				accesos
			});	


		});

	}, //close getAccesosByUser

	getAcceso: function (req,res){
		//conseguir el id del acceso
		var accesoId = req.params.id;

		//find con la condicion de usuario
		Acceso.findById(accesoId)
				.populate('user') //hace que levante el objeto de usuario completo en la consulta por el id
				.exec((err, acceso) =>{

			if(err){
				return res.status(500).send({
					status: 'error',
					message: 'Error al hacer la consulta'
				});	
			}

			if(!acceso){
				return res.status(404).send({
					status: 'error',
					message: 'No se encontro el Acceso'
				});	
			}

			//devolver resultado
			return res.status(200).send({
				status: 'success',
				acceso
			});	


		});


	}, //close getAcceso

	update: function(req,res){
		//recoger el id del acceso de la url
		var accesoId = req.params.id

		//recoger los datos que llegan desde post
		var params = req.body;

		//validar los datos
		try{
			var validate_tipo = !validator.isEmpty(params.tipo);
			var validate_nombre = !validator.isEmpty(params.nombre);
			var validate_clave = !validator.isEmpty(params.clave);
			//valido mail si es que lo ingresa
			if (params.email){
				var validate_email = validator.isEmail(params.email);
			}else{
				var validate_email = true;
			}

		}catch(err){
			return res.status(500).send({
				status: 'error',
				message: 'Faltan datos por enviar'
			});	
		}

		if (validate_clave && validate_nombre && validate_tipo && validate_email){
			//montar un json con los datos modificables
			var update = {
				tipo: params.tipo,
				nombre: params.nombre,
				descripcion: params.descripcion,
				paginaweb: params.paginaweb,
				email: params.email,
				usuario: params.usuario,
				clave: params.clave,
				observaciones: params.observaciones,
				date: new Date(),
				user: req.user.sub
			}

			//hacer un find and update del acceso por id
			Acceso.findOneAndUpdate({_id: accesoId}, update, {new:true}, (err, accesoUpdated) =>{
				if(err){
					return res.status(500).send({
						status: 'error',
						message: 'Error en la peticion'
					});						
				}
				if(!accesoUpdated){
					return res.status(404).send({
						status: 'error',
						message: "No se ha actualizado el acceso"
					});						
				}

				//devolver resultado
				return res.status(200).send({
					status: 'success',
					acceso: accesoUpdated
				});	

			});

		}else {
			return res.status(500).send({
				status: 'error',
				message: 'La validacion de los datos no es correcta'
			});				
		}

	}, //close update

	delete: function(req,res){
		//sacar el id del acceso de la url
		var accesoId = req.params.id

		//find and delete por acceso id
		Acceso.findOneAndDelete({_id: accesoId}, (err,accesoRemoved) => {

			if(err){
				return res.status(500).send({
					status: 'error',
					message: 'Error en la peticion'
				});						
			}
			if(!accesoRemoved){
				return res.status(404).send({
					status: 'error',
					message: 'No se ha borrado el Acceso'
				});						
			}

			//devolver resultado
			return res.status(200).send({
				status: 'success',
				acceso: accesoRemoved
			});	
		});

	}, //close delete

	search: function(req,res){
		//sacar el string a buscar de la url
		var searchString = req.params.search

		//find or
		Acceso.find({ "$or": [
			{"tipo": { "$regex": searchString, "$options": "i"} },
			{"nombre": { "$regex": searchString, "$options": "i"} },
			{"descripcion": { "$regex": searchString, "$options": "i"} },
			{"paginaweb": { "$regex": searchString, "$options": "i"} }
		]})
		.sort([['date','descending']])
		.exec((err, accesos) => {
			if(err){
				return res.status(500).send({
					status: 'error',
					message: "Error en la peticion"
				});						
			}
			if(!accesos){
				return res.status(404).send({
					status: 'error',
					message: "No se ha encontrado Accesos"
				});						
			}

			//devolver resultado
			return res.status(200).send({
				status: 'success',
				accesos
			});				
		});

	}
	
};


module.exports = controller;
