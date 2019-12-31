'use strict'
var validator = require('validator');
var Topic = require('../models/topic');

var controller = {

	add: function(req, res){

		//recoger el id del topic por la url
		var topicId = req.params.topicId;

		//find por id del topic
		Topic.findById(topicId).exec((err, topic) =>{

			if(err){
				return res.status(500).send({
					status: 'error',
					message: "error en la peticion"
				})
			}

			if(!topic){
				return res.status(404).send({
					status: 'error',
					message: "No existe el Topic"
				})
			}

			//comprobar objeto usuario y validar datos
			if(req.body.content){

				//validar los datos
				try{
					//validar los datos
					var validate_content = !validator.isEmpty(req.body.content);
				}catch(err){
					return res.status(500).send({
						status: 'error',
						message: "No has comentado nada"
					});	
				}

				if (validate_content){
					var comment = {
						user: req.user.sub,
						content: req.body.content
					}

					//en la propiedad comments del objeto resultante hacer un push
					topic.comments.push(comment);


					//guardar el topic completo
					topic.save((err) => {
						if(err){
							return res.status(500).send({
								status: 'error',
								message: "Error al guardar el comentario"
							});
						}



						//flevantar nuevamente todos los datos del topic a devolver
						Topic.findById(topic._id)
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

					})


				}else{
					return res.status(500).send({
						status: 'error',
						message: "No has comentado nada"
					});						
				}
			}

		});

	},

	update: function(req, res){
		//conseguir el id del comentario de la url
		var comentId= req.params.comentId;

		//recoger datos y validar
		var params = req.body;

		//validar los datos
		try{
			//validar los datos
			var validate_content = !validator.isEmpty(params.content);
		}catch(err){
			return res.status(500).send({
				status: 'error',
				message: "No has comentado nada"
			});	
		}

		if (validate_content){
			//guardar el topic completo
			Topic.findOneAndUpdate({"comments._id": comentId},
				{
					"$set": {
						"comments.$.content": params.content
					}
				},
				{new:true},
				(err, topicUpdated) => {

					if(err){
						return res.status(500).send({
							status: 'error',
							message: "Error al modificar el comentario"
						});
					}

					if(!topicUpdated){
						return res.status(404).send({
							status: 'error',
							message: "No existe el Topic"
						})
					}

					//devolver resultado
					return res.status(200).send({
						status: 'success',
						topic: topicUpdated
					});
				}
			);

		}
	},

	delete: function(req, res){
		//sacar el id topic y del comentario a borrar
		var topicId = req.params.topicId;
		var comentId = req.params.comentId;

		//buscar el topic
		Topic.findById(topicId, (err, topic) =>{

			if(err){
				return res.status(500).send({
					status: 'error',
					message: "Error al borrar el comentario"
				});
			}

			if(!topic){
				return res.status(404).send({
					status: 'error',
					message: "No existe el Topic"
				})
			}

			//seleccionar el subdocumento (comentario)
			var coment = topic.comments.id(comentId);

			//borrar el comentario
			if (coment){
				coment.remove();

				//guardar el topic
				topic.save((err) =>{
					if(err){
						return res.status(500).send({
							status: 'error',
							message: "Error al borrar el comentario"
						});
					}

						//	flevantar nuevamente todos los datos del topic a devolver
					Topic.findById(topic._id)
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

				})

			}else{
				return res.status(404).send({
					status: 'error',
					message: "No existe el Comentario"
				})

			}

		});

	}

};

module.exports = controller;