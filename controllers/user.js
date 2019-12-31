'use strict'

var validator = require('validator');
var User = require('../models/user');
var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt');
var jwt = require('../services/jwt');


var controller = {

	probando:function(req, res){
		return res.status(200).send({
			message: "soy el metodo probando"
		})
	},

	testeando: function(req, res){
		return res.status(200).send({
			message: "soy el metodo testeando"
		})
	},

	save: function(req, res){

		//recoger los parametros de la peticion
		var params = req.body;
		try{
			//validar los datos
			var validate_name = !validator.isEmpty(params.name);
			var validate_surname = !validator.isEmpty(params.surname);
			var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
			var validate_password = !validator.isEmpty(params.password);
		}catch(err){
			return res.status(500).send({
				message: "Faltan datos por enviar"
			});	
		}
		if (validate_name &&  validate_surname && validate_email && validate_password){
			//cear el objeto de usuario
			var user = new User();

			//asignar valores al usuario
			user.name = params.name;
			user.surname = params.surname;
			user.email = params.email.toLowerCase();
			user.role ='ROLE_USER';
			user.image= null;
			user.idsistemaadmin=0;

			//comprobar si usuario existe
			User.findOne({email: user.email}, (err, issetUser) => {
				if(err){
					return res.status(500).send({
						message: "Error al comprobar duplicidad de usuario"
					});
				}

				if(!issetUser){
					//si no existe, cifrar la contraseña 

					bcrypt.hash(params.password, 10, function(err, hash) {
						user.password = hash;

						// guardarlo
						user.save((err, userStored) =>{
							if(err){
								return res.status(500).send({
									message: "Error al guardar el usuario"
								});
							}
							if(!userStored){
								return res.status(500).send({
									message: "El usuario no se ha guardado"
								});
							}

							//devolver respuesta
							return res.status(200).send({
								status:'success',
								user: userStored
							});

						}); //close save
					}); // close bcrypt

				}else{
					return res.status(500).send({
						message: "El usuario ya esta registrado"
					});
				}
			});
		}else{
			//devolver respuesta
			return res.status(200).send({
				message: "Validacion de los datos del usuario incorrecta, intentalo de nuevo"
			});
		}

	}, // close function save

	login: function (req, res){
		//recoger los parametros de la peticion
		var params = req.body;

		try{
			//validar los datos
			var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
			var validate_password = !validator.isEmpty(params.password);
		}catch(err){
			return res.status(500).send({
				message: "Faltan datos por enviar"
			});	
		}

		if (!validate_email || !validate_password){
			return res.status(500).send({
				message: "Los datos son incorrectos. Reenviarlo"
			});
		}

		//buscar usuario que coincida
		User.findOne({email: params.email.toLowerCase()}, (err, user) => {
			if(err || !user){
				return res.status(500).send({
					message: "Error al intentar identificarse"
				});
			}


			//si lo encuentra comprobar su contraseña y email
			bcrypt.compare(params.password, user.password, function(err, check) {
				if(check){
					//generar token de jwt
					if(params.gettoken){
						//si es correcto , devolver los datos
						return res.status(200).send({
							token: jwt.createToken(user)
						});

					}else{

						//limpiar el objeto
						user.password = undefined;

						//si es correcto , devolver los datos
						return res.status(200).send({
							status: 'success',
							user
						});
					}
				}else{
					return res.status(500).send({
						message: 'Password incorrecta'
					});					
				}
			});

		});
	}, //close login

	update: function(req, res){
		//recoger los datos del usuario
		var params = req.body

		//validar los datos
		try{
			var validate_name = !validator.isEmpty(params.name);
			var validate_surname = !validator.isEmpty(params.surname);
			var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
		}catch(err){
			return res.status(500).send({
				message: "Faltan datos por enviar"
			});	
		}

		if (validate_name &&  validate_surname && validate_email ){

			//eliminar propiedades innecesarias
			delete params.password;

			//buscar y actualizar
			var userId = req.user.sub;

			//comprobar si el email es unico
			if(req.user.email != params.email ){
				User.findOne({email: params.email.toLowerCase()}, (err, user) => {
					if(err){
						return res.status(500).send({
							message: "Error al intentar identificarse"
						});
					}
					if(user && user.email == params.email){
						return res.status(500).send({
							message: "El email no puede ser modificado"
						});
					}else{

						User.findOneAndUpdate({_id:userId},params,{new:true},(err,userUpdate) =>{
							if(err || !userUpdate){
								return res.status(500).send({
									status: 'Error',
									message: 'Error al actualizar los datos'
								});	
							}

							//devolver respuesta
							userUpdate.password=undefined;
							return res.status(200).send({
								status: 'success',
								user: userUpdate
							});					

						});
					}

				});

			}else {

				User.findOneAndUpdate({_id:userId},params,{new:true},(err,userUpdate) =>{
					if(err || !userUpdate){
						return res.status(500).send({
							status: 'Error',
							message: 'Error al actualizar los datos'
						});	
					}

					//devolver respuesta
					userUpdate.password=undefined;
					return res.status(200).send({
						status: 'success',
						user: userUpdate
					});					

				});
			}
		}

	}, //close update

	uploadAvatar: function(req, res){ 
		//configurar el modulo multiparty (md) (esto esta hecho en rutes/user.js)

		//recoger el fichero de la peticion
		var file_name = 'Avatar no subido...';

		if(!req.files){
			return res.status(404).send({
				status: 'Error',
				message: file_name
			});	
		}

		//conseguir el nombre y la extension del archivo subido
		var file_path = req.files.file0.path;
		var file_split = file_path.split('/');
		
		//nombre archivo
		var file_name = file_split[2];

		//extension archivo
		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];

		//comprobar extension (solo imagenes), si no es valida borrar fichero subido
		if(file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif'){
			fs.unlink(file_path, (err) => {
				return res.status(400).send({
					status: 'error',
					message: 'La extension del archivo no es valida',
				});			

			});
		}else{

			//sacar el id del usuario identificado
			var userId = req.user.sub;

			//buscar y actualizar documento db
			User.findOneAndUpdate({_id: userId},{image: file_name}, {new:true}, (err, userUpdate) =>{
				if(err || !userUpdate){
					return res.status(400).send({
						status: 'error',
						message: 'Error al guardar usuario'
					});	
				}
				//devolver respuesta
				return res.status(200).send({
					status: 'success',
					user: userUpdate
				});			

			});

		}
	}, //close uploadavatar

	avatar: function(req, res){
		var fileName = req.params.fileName;

		var pathFile = './uploads/users/'+fileName;

		fs.exists(pathFile, (exists) => {
			if(exists){
				return res.sendFile(path.resolve(pathFile));
			}else{
				return res.status(400).send({
					status: 'error',
					message: 'La imagen no existe'
				});					
			}
		});
	}, // close avatar

	getUsers: function(req,res){
		User.find().exec((err,users) => {
			if(err || !users){
				return res.status(404).send({
					status: 'error',
					message: 'No hay usuarios que mostrar'
				});					
			}
			return res.status(200).send({
				status: 'success',
				users
			});			
		});
	}, // close getusers

	getUser: function(req,res){
		var userId = req.params.userId;

		User.findById(userId).exec((err,user) => {
			if(err || !user){
				return res.status(404).send({
					status: 'error',
					message: 'No se encontro el usuario'
				});					
			}
			return res.status(200).send({
				status: 'success',
				user
			});			
		});

	} // close getuser


};


module.exports = controller;
