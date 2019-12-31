'use strict'
var validator = require('validator');
var Topic = require('../models/topic');

var controller = {

	test: function(req, res){
		return res.status(200).send({
			message: "soy el metodo testeando"
		})
	},

	save: function(req,res){
		//recoger los parametros por post
		var params = req.body;

		//validar los datos
		try{
			//validar los datos
			var validate_title = !validator.isEmpty(params.title);
			var validate_content = !validator.isEmpty(params.content);
			var validate_system = !validator.isEmpty(params.system);

		}catch(err){
			return res.status(500).send({
				message: "Faltan datos por enviar"
			});	
		}

		if (validate_content && validate_system && validate_title){
			//crear el objeto a guardar
			var topic = new Topic();

			//asignar valores
			topic.title = params.title;
			topic.content = params.content;
			topic.module = params.module;
			topic.system = params.system;
			topic.user = req.user.sub;

			//guardar el topic
			topic.save((err,topicStored) => {

				if(err || !topicStored){
					return res.status(404).send({
						status: 'error',
						message: 'El tema no se ha guardado'
					});	
				}

				//devolver respuesta
				return res.status(200).send({
					status: 'success',
					topic: topicStored
				})		
			});


		}else{
			return res.status(500).send({
				message: "Los datos no son validos"
			});	

		}
	}, // close save

	getTopics: function(req, res){
		//cargar la libreria de paginacion en la clase (MODELO)

		//recoger la pagina actual
		if (!req.params.page || req.params.page == 0 || req.params.page == '0'  || req.params.page == null || req.params.page == undefined){
			var page = 1
		}else{
			var page = parseInt(req.params.page);
		}

		//indicar las opciones de paginacion
		var options = {
			sort: { date: -1}, //orden descendente,
			populate: 'user', //esto hace que con el id de usuario guardado me cargue el objeto completo de usuario
			limit: 5,
			page: page
		}

		//Find paginado
		Topic.paginate({}, options, (err, topics) => {

			if(err){
				return res.status(500).send({
					status: 'error',
					message: 'Error al hacer la consulta'
				});	
			}


			if(!topics){
				return res.status(404).send({
					status: 'error',
					message: 'No se encontraron topics'
				});	
			}

			//devolver resultado (topics, total de topics, total de paginas)
			return res.status(200).send({
				status: 'success',
				topics: topics.docs,
				totalDocs: topics.totalDocs,
				totalPages: topics.totalPages
			});	

		}); //primera parte poder poner condicion

	}, //close get topicsç

	getTopicsByUser: function(req,res){
		//conseguir el id del usuario
		var userId = req.params.user;

		//find con la condicion de usuario
		Topic.find({user: userId}).sort([['date','descending']]).exec((err, topics) =>{

			if(err){
				return res.status(500).send({
					status: 'error',
					message: 'Error al hacer la consulta'
				});	
			}

			if(!topics){
				return res.status(404).send({
					status: 'error',
					message: 'No se encontraron topics del usuario'
				});	
			}

			//devolver resultado
			return res.status(200).send({
				status: 'success',
				topics
			});	


		});

	}, //close getTopicsByUser

	getTopic: function (req,res){
		//conseguir el id del topic
		var topicId = req.params.id;

		//find con la condicion de usuario
		Topic.findById(topicId)
				.populate('user') //hace que levante el objeto de usuario completo en la consulta por el id
				.populate('comments.user') 
				.exec((err, topic) =>{

			if(err){
				return res.status(500).send({
					status: 'error',
					message: 'Error al hacer la consulta'
				});	
			}

			if(!topic){
				return res.status(404).send({
					status: 'error',
					message: 'No se encontro el Topic'
				});	
			}

			//devolver resultado
			return res.status(200).send({
				status: 'success',
				topic
			});	


		});


	}, //close getTopic

	update: function(req,res){
		//recoger el id del topic de la url
		var topicId = req.params.id

		//recoger los datos que llegan desde post
		var params = req.body;

		//validar los datos
		try{
			//validar los datos
			var validate_title = !validator.isEmpty(params.title);
			var validate_content = !validator.isEmpty(params.content);
			var validate_system = !validator.isEmpty(params.system);

		}catch(err){
			return res.status(500).send({
				status: 'error',
				message: "Faltan datos por enviar"
			});	
		}

		if (validate_content && validate_system && validate_title){
			//montar un json con los datos modificables
			var update = {
				title: params.title,
				content: params.content,
				module: params.module,
				system: params.system
			}

			//hacer un find and update del topic por id y por id de usuario
			Topic.findOneAndUpdate({_id: topicId, user: req.user.sub}, update, {new:true}, (err, topicUpdated) =>{
				if(err){
					return res.status(500).send({
						status: 'error',
						message: "Error en la peticion"
					});						
				}
				if(!topicUpdated){
					return res.status(404).send({
						status: 'error',
						message: "No se ha actualizado el topic"
					});						
				}

				//devolver resultado
				return res.status(200).send({
					status: 'success',
					topic: topicUpdated
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
		//sacar el id del topic de la url
		var topicId = req.params.id

		//find and delete por topic id y por user id (usuario identificado)
		Topic.findOneAndDelete({_id: topicId, user: req.user.sub}, (err,topicRemoved) => {

			if(err){
				return res.status(500).send({
					status: 'error',
					message: "Error en la peticion"
				});						
			}
			if(!topicRemoved){
				return res.status(404).send({
					status: 'error',
					message: "No se ha borrado el topic"
				});						
			}

			//devolver resultado
			return res.status(200).send({
				status: 'success',
				topic: topicRemoved
			});	
		});

	}, //close delete

	search: function(req,res){
		//sacar el string a buscar de la url
		var searchString = req.params.search

		//find or
		Topic.find({ "$or": [
			{"title": { "$regex": searchString, "$options": "i"} },
			{"content": { "$regex": searchString, "$options": "i"} },
			{"module": { "$regex": searchString, "$options": "i"} },
			{"system": { "$regex": searchString, "$options": "i"} }
		]})
		.populate('user') //hace que levante el objeto de usuario completo en la consulta por el id
		.sort([['date','descending']])
		.exec((err, topics) => {
			if(err){
				return res.status(500).send({
					status: 'error',
					message: "Error en la peticion"
				});						
			}
			if(!topics){
				return res.status(404).send({
					status: 'error',
					message: "No se ha encontrado topics"
				});						
			}

			//devolver resultado
			return res.status(200).send({
				status: 'success',
				topics: topics
			});				
		});

	}
};


module.exports = controller;
