'use strict'

var express = require('express');
var AccesoController = require('../controllers/acceso');

var router = express.Router();

var md_auth = require('../middlewares/authenticated');

//var multipart = require('connect-multiparty');
//var md_upload = multipart({ uploadDir: './uploads/users'});


//rutas de prueba
router.get('/acceso/test', AccesoController.test);


//rutas de acceso
router.post('/acceso', md_auth.authenticated, AccesoController.save);
router.get('/accesos', AccesoController.getAccesos);
router.get('/user-accesos/:user', AccesoController.getAccesosByUser);
router.get('/acceso/:id', AccesoController.getAcceso);
router.put('/acceso/:id', md_auth.authenticated, AccesoController.update);
router.delete('/acceso/:id', md_auth.authenticated, AccesoController.delete);
router.get('/accesosearch/:search', AccesoController.search);


module.exports = router;