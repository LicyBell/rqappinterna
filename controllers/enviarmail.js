'use strict'
var validator = require('validator');
var nodemailer = require('nodemailer');

var controller = {

	enviarmail: function(req,res){
		//recoger los parametros por post
		var params = req.body;

		//validar los datos
		try{
			//validar los datos
			var validate_name = !validator.isEmpty(params.name);
			var validate_clave = !validator.isEmpty(params.password);
			//valido mail si es que lo ingresa
			if (params.email){
				var validate_email = validator.isEmail(params.email);
			}else{
				var validate_email = false;
			}

		}catch(err){
			return res.status(500).send({
				status: 'error',
				message: 'Faltan datos (Obligatorio:  nombre, clave, mail).'
			});	
		}

	    console.log("Creating transport...");
	    var transporter = nodemailer.createTransport({
			service: 'Gmail',
			auth: {
				user: 'licybellmann@gmail.com',
				pass: '23578244'
			}
	    });

	    var mailOptions = {
	      from:  'licybellmann@gmail.com',
	      to: params.email,
	      subject: 'Registro a 	rqapp',
	      text: 'Se a realizado a registracion a nuestro sistema. Para poder logearse debe utilizar email: '+params.email+' y contraseña: '+params.password
	    };

	    console.log("sending email", mailOptions);
	    transporter.sendMail(mailOptions, function (error, info) {
	      console.log("senMail returned!");
	      if (error) {
	        console.log("ERROR!!!!!!", error);

			return res.status(500).send({
				status: 'error',
				message: error
			});	


	      } else {

	        console.log('Email sent: ' + info.response);

			return res.status(200).send({
				status: 'success',
				message: 'Email enviado: ' + info.response
			});	

	      }
	    });

	    console.log("End of Script");
	}
};


module.exports = controller;