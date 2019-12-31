'use strict'
var validator = require('validator');
var Clientdoc = require('../models/clientdoc');

var controller = {



	save: function(req,res){
		//recoger los parametros por post
		var params = req.body;

		//validar los datos
		try{
			//validar los datos
			var validate_cliente = !validator.isEmpty(params.cliente);
			var validate_cuit = !validator.isEmpty(params.cuit);

		}catch(err){
			return res.status(500).send({
				message: "Faltan datos por enviar"
			});	
		}

		if (validate_cliente && validate_cuit){
			//crear el objeto a guardar
			var clientdoc = new Clientdoc();

			//asignar valores
			clientdoc.cliente = params.cliente;
			clientdoc.razonsocial = params.razonsocial;
			clientdoc.cuit = params.cuit;
			clientdoc.idsistemaadmin = +params.idsistemaadmin;
			clientdoc.observaciones = params.observaciones;
			clientdoc.user = req.user.sub;

			//guardar el clientdoc
			clientdoc.save((err,clientDocStored) => {

				if(err || !clientDocStored){
					return res.status(404).send({
						status: 'error',
						message: 'La informacion no se ha guardado'
					});	
				}else{

					//devolver resultado
					return res.status(200).send({
						status: 'success',
						clientdoc: clientDocStored
					});	
				}
	
			});

		}else{
			return res.status(500).send({
				message: "Los datos no son validos"
			});	
		}

	}, // close save


	delete: function(req,res){
		//sacar el id del clientdoc de la url
		var clientdocId = req.params.id

		//find and delete por clientdoc id 
		Clientdoc.findOneAndDelete({_id: clientdocId}, (err,clientdocRemoved) => {

			if(err){
				return res.status(500).send({
					status: 'error',
					message: "Error en la peticion"
				});						
			}
			if(!clientdocRemoved){
				return res.status(404).send({
					status: 'error',
					message: "No se ha borrado el clientdoc"
				});						
			}

			//devolver resultado
			return res.status(200).send({
				status: 'success',
				clientdoc: clientdocRemoved
			});	
		});

	}, //close delete	

	getClientDocs: function(req, res){
		//find con la condicion de usuario
		Clientdoc.find().sort([['cliente',1]]).exec((err, clientdocs) =>{

			if(err){
				return res.status(500).send({
					status: 'error',
					message: 'Error al hacer la consulta'
				});	
			}

			if(!clientdocs){
				return res.status(404).send({
					status: 'error',
					message: 'No se encontraron clientdocs '
				});	
			}

			//devolver resultado
			return res.status(200).send({
				status: 'success',
				clientdocs
			});	


		});

	}, //close getclientdocsByUser

	getClientDoc: function (req,res){
		//conseguir el id del clientdoc
		var clientdocId = req.params.id;

		//find con la condicion de usuario
		Clientdoc.findById(clientdocId)
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


	}, //close getclientdoc


	getClientDocUsuario: function (req,res){
		//conseguir el id del clientdoc del sistema
		var Idsistemaadmin = +req.params.Idsistemaadmin;

		//find con la condicion de usuario
		Clientdoc.findOne({idsistemaadmin: Idsistemaadmin})
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


	}, //close getclientdoc	

	update: function(req,res){
		//recoger el id del clientdoc de la url
		var clientdocId = req.params.id

		//recoger los datos que llegan desde post
		var params = req.body;

		//validar los datos
		try{
			//validar los datos
			var validate_cliente = !validator.isEmpty(params.cliente);
			var validate_cuit = !validator.isEmpty(params.cuit);

		}catch(err){
			return res.status(500).send({
				status: 'error',
				message: "Faltan datos por enviar"
			});	
		}

		if (validate_cliente && validate_cuit){
			//montar un json con los datos modificables
			var update = {
				cliente : params.cliente,
				razonsocial : params.razonsocial,
				cuit : params.cuit,
				idsistemaadmin : +params.idsistemaadmin,
				observaciones : params.observaciones,
				date:  new Date(),
				user : req.user.sub
			}

			console.log(update);

			//hacer un find and update del clientdoc por id 
			Clientdoc.findOneAndUpdate({_id: clientdocId}, update, {new:true}, (err, clientdocUpdated) =>{
				if(err){
					return res.status(500).send({
						status: 'error',
						message: "Error en la peticion"
					});						
				}
				if(!clientdocUpdated){
					return res.status(404).send({
						status: 'error',
						message: "No se ha actualizado el clientdoc"
					});						
				}

				//devolver resultado
				return res.status(200).send({
					status: 'success',
					clientdoc: clientdocUpdated
				});	

			});

		}else {
			return res.status(500).send({
				status: 'error',
				message: 'La validacion de los datos no es correcta'
			});				
		}

	}, //close update

	

	search: function(req,res){
		//sacar el string a buscar de la url
		var searchString = req.params.search

		//find or
		Clientdoc.find({ "$or": [
			{"cliente": { "$regex": searchString, "$options": "i"} },
			{"razonsocial": { "$regex": searchString, "$options": "i"} },
			{"cuit": { "$regex": searchString, "$options": "i"} }
		]})
		.sort([['date','descending']])
		.exec((err, clientdocs) => {
			if(err){
				return res.status(500).send({
					status: 'error',
					message: "Error en la peticion"
				});						
			}
			if(!clientdocs){
				return res.status(404).send({
					status: 'error',
					message: "No se ha encontrado clientdocs"
				});						
			}

			//devolver resultado
			return res.status(200).send({
				status: 'success',
				clientdocs: clientdocs
			});				
		});

	}
	
};


module.exports = controller;
