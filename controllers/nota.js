'use strict'
var validator = require('validator');
var Nota = require('../models/nota');

var controller = {

	test: function(req, res){
		return res.status(200).send({
			message: "soy el metodo testeando notas"
		})
	},


	save: function(req,res){
		//recoger los parametros por post
		var params = req.body;

		//validar los datos
		try{
			//validar los datos
			var validate_titulo = !validator.isEmpty(params.titulo);
			var validate_tema = !validator.isEmpty(params.tema);
			var validate_contenido = !validator.isEmpty(params.contenido);
			
		}catch(err){
			return res.status(500).send({
				status: 'error',
				message: 'Faltan datos (Obligatorio: titulo, tema, contenido). '
			});	
		}

		if (validate_titulo && validate_tema && validate_contenido){
			//crear el objeto a guardar
			var nota = new Nota();

			//asignar valores
			nota.titulo = params.titulo;
			nota.tema = params.tema;
			nota.web = params.web;
			nota.contenido = params.contenido;
			nota.user = req.user.sub;

			//guardar el acceso
			nota.save((err, notaStored) => {

				if(err || !notaStored){
					console.log(err);

					return res.status(404).send({
						status: 'error',
						message: 'La Nota no se ha guardado'
					});	
				}

				//devolver respuesta
				return res.status(200).send({
					status: 'success',
					nota: notaStored
				});		
			});


		}else{
			return res.status(500).send({
				status: 'error',
				message: 'Faltan datos (Obligatorio: titulo, tema, contenido).'
			});	

		}
	}, // close save

	getNotas: function(req, res){
		//find con la condicion de usuario
		Nota.find().sort([['date','descending']]).exec((err, notas) =>{

			if(err){
				return res.status(500).send({
					status: 'error',
					message: 'Error al hacer la consulta de notas'
				});	
			}

			if(!notas){
				return res.status(404).send({
					status: 'error',
					message: 'No se encontraron Notas'
				});	
			}

			//devolver resultado
			return res.status(200).send({
				status: 'success',
				notas
			});	


		});

	}, //close get notas

	getNotasByUser: function(req,res){
		//conseguir el id del usuario
		var userId = req.params.user;

		//find con la condicion de usuario
		Nota.find({user: userId}).sort([['date','descending']]).exec((err, notas) =>{

			if(err){
				return res.status(500).send({
					status: 'error',
					message: 'Error al hacer la consulta de notas por usuario'
				});	
			}

			if(!notas){
				return res.status(404).send({
					status: 'error',
					message: 'No se encontraron Notas del usuario'
				});	
			}

			//devolver resultado
			return res.status(200).send({
				status: 'success',
				notas
			});	


		});

	}, //close getAccesosByUser

	getNota: function (req,res){
		//conseguir el id del acceso
		var notaId = req.params.id;

		//find con la condicion de usuario
		Nota.findById(notaId)
				.populate('user') //hace que levante el objeto de usuario completo en la consulta por el id
				.exec((err, nota) =>{

			if(err){
				return res.status(500).send({
					status: 'error',
					message: 'Error al hacer la consulta'
				});	
			}

			if(!nota){
				return res.status(404).send({
					status: 'error',
					message: 'No se encontro la Nota'
				});	
			}

			//devolver resultado
			return res.status(200).send({
				status: 'success',
				nota
			});	


		});


	}, //close getAcceso

	update: function(req,res){
		//recoger el id del acceso de la url
		var notaId = req.params.id

		//recoger los datos que llegan desde post
		var params = req.body;

		//validar los datos
		try{
			//validar los datos
			var validate_titulo = !validator.isEmpty(params.titulo);
			var validate_tema = !validator.isEmpty(params.tema);
			var validate_contenido = !validator.isEmpty(params.contenido);
			
		}catch(err){
			return res.status(500).send({
				status: 'error',
				message: 'Faltan datos (Obligatorio: titulo, tema, contenido). '
			});	
		}

		if (validate_titulo && validate_tema && validate_contenido){
			//montar un json con los datos modificables
			var update = {
				titulo: params.titulo,
				tema: params.tema,
				web: params.web,
				contenido: params.contenido,
				date: new Date(),
				user: req.user.sub
			}

			//hacer un find and update del acceso por id
			Nota.findOneAndUpdate({_id: notaId}, update, {new:true}, (err, notaUpdated) =>{
				if(err){
					return res.status(500).send({
						status: 'error',
						message: 'Error en la peticion'
					});						
				}
				if(!notaUpdated){
					return res.status(404).send({
						status: 'error',
						message: "No se ha actualizado la Nota"
					});						
				}

				//devolver resultado
				return res.status(200).send({
					status: 'success',
					nota: notaUpdated
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
		var notaId = req.params.id

		//find and delete por acceso id
		Nota.findOneAndDelete({_id: notaId}, (err,notaRemoved) => {

			if(err){
				return res.status(500).send({
					status: 'error',
					message: 'Error en la peticion'
				});						
			}
			if(!notaRemoved){
				return res.status(404).send({
					status: 'error',
					message: 'No se ha borrado la nota'
				});						
			}

			//devolver resultado
			return res.status(200).send({
				status: 'success',
				nota: notaRemoved
			});	
		});

	}, //close delete

	search: function(req,res){
		//sacar el string a buscar de la url
		var searchString = req.params.search

		//find or
		Nota.find({ "$or": [
			{"titulo": { "$regex": searchString, "$options": "i"} },
			{"tema": { "$regex": searchString, "$options": "i"} },
			{"web": { "$regex": searchString, "$options": "i"} },
			{"contenido": { "$regex": searchString, "$options": "i"} }
		]})
		.sort([['date','descending']])
		.exec((err, notas) => {
			if(err){
				return res.status(500).send({
					status: 'error',
					message: "Error en la peticion"
				});						
			}
			if(!notas){
				return res.status(404).send({
					status: 'error',
					message: "No se ha encontrado Notas"
				});						
			}

			//devolver resultado
			return res.status(200).send({
				status: 'success',
				notas
			});				
		});

	}

};


module.exports = controller;
