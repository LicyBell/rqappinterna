'use strict'
var validator = require('validator');
var Clientdoc = require('../models/clientdoc');

var controller = {

	add: function(req, res){

		//recoger el id del clientdoc por la url
		var clientdocId = req.params.clientdocId;
		
		//find por id del documento
		Clientdoc.findById(clientdocId).exec((err, clientdoc) =>{

			if(err){
				return res.status(500).send({
					status: 'error',
					message: "error en la peticion"
				})
			}

			if(!clientdoc){
				return res.status(404).send({
					status: 'error',
					message: "No existe el documento"
				})
			}

			//recoger los parametros por post
			var params = req.body;

			//validar los datos
			try{
				//validar los datos
				var validate_nombre = !validator.isEmpty(params.nombre);

			}catch(err){
				return res.status(500).send({
					message: "Faltan datos por enviar"
				});	
			}

			if (validate_nombre ){
				var proyectoClient = {
					nombre: params.nombre,
					modulo: params.modulo,
					observaciones: params.observaciones
				}

				//en la propiedad proyectoClient del objeto resultante hacer un push
				clientdoc.proyectos.push(proyectoClient);


				//guardar el clientdoc completo
				clientdoc.save((err) => {
					if(err){
						return res.status(500).send({
							status: 'error',
							message: "Error al guardar el proyecto"
						});
					}

					//flevantar nuevamente todos los datos del clientdoc a devolver
					Clientdoc.findById(clientdoc._id)
							.exec((err, clientdoc) =>{

						if(err){
							return res.status(500).send({
								status: 'error',
								message: 'Error al hacer la consulta'
							});	
						}

						if(!clientdoc){
							return res.status(404).send({
								status: 'error',
								message: 'No se encontro el clientdoc'
							});	
						}

						//devolver resultado
						return res.status(200).send({
							status: 'success',
							clientdoc
						});	

					});
				})


			}else{
				return res.status(500).send({
					status: 'error',
					message: "No has cargado nada"
				});						
			}

		});

	},

	delete: function(req, res){
		//sacar el id clientdoc y del comentario a borrar
		var clientdocId = req.params.clientdocId;
		var proyectoclientId = req.params.proyectoclientId;

		//buscar el clientdoc
		Clientdoc.findById(clientdocId, (err, clientdoc) =>{

			if(err){
				return res.status(500).send({
					status: 'error',
					message: "Error al borrar el ipclient"
				});
			}

			if(!clientdoc){
				return res.status(404).send({
					status: 'error',
					message: "No existe el clientdoc"
				})
			}

			//seleccionar el subdocumento (comentario)
			var proyectoclientdoc = clientdoc.proyectos.id(proyectoclientId);

			//borrar el comentario
			if (proyectoclientdoc){
				proyectoclientdoc.remove();

				//guardar el clientdoc
				clientdoc.save((err) =>{
					if(err){
						return res.status(500).send({
							status: 'error',
							message: "Error al borrar el proyecto"
						});
					}

					//devolver un resultado
					return res.status(200).send({
						status: 'success',
						clientdoc
					});

				})

			}else{
				return res.status(404).send({
					status: 'error',
					message: "No existe el ipclient"
				})

			}

		});

	}

};

module.exports = controller;