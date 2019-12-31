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
				var validate_usuario = !validator.isEmpty(params.usuario);
				var validate_contrasenia = !validator.isEmpty(params.contrasenia);
				var validate_direccion = !validator.isEmpty(params.direccion);

			}catch(err){
				return res.status(500).send({
					message: "Faltan datos por enviar"
				});	
			}

			if (validate_contrasenia && validate_direccion && validate_usuario){
				var ftpClient = {
					usuario: params.usuario,
					contrasenia: params.contrasenia,
					direccion: params.direccion,
					observaciones: params.observaciones
				}

				//en la propiedad ftpClient del objeto resultante hacer un push
				clientdoc.ftps.push(ftpClient);


				//guardar el clientdoc completo
				clientdoc.save((err) => {
					if(err){
						return res.status(500).send({
							status: 'error',
							message: "Error al guardar el ftp"
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
		var ftpclientId = req.params.ftpclientId;

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
			var ftpclientdoc = clientdoc.ftps.id(ftpclientId);

			//borrar el comentario
			if (ftpclientdoc){
				ftpclientdoc.remove();

				//guardar el clientdoc
				clientdoc.save((err) =>{
					if(err){
						return res.status(500).send({
							status: 'error',
							message: "Error al borrar el ipclient"
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