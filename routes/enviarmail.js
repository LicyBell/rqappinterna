'use strict'

var express = require('express');
var EnviarmailController = require('../controllers/enviarmail');

var router = express.Router();

var multipart = require('connect-multiparty');


//rutas de prueba
router.post('/enviarmail', EnviarmailController.enviarmail);


module.exports = router;