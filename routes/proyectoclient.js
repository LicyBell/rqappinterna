'use strict'

var express = require('express');
var proyectoclientController = require('../controllers/proyectoclient');

var router = express.Router();

var md_auth = require('../middlewares/authenticated');

//var multipart = require('connect-multiparty');
//var md_upload = multipart({ uploadDir: './uploads/users'});


//rutas de topics
router.post('/proyectoclient/clientdoc/:clientdocId', md_auth.authenticated, proyectoclientController.add);
router.delete('/proyectoclient/:clientdocId/:proyectoclientId', md_auth.authenticated, proyectoclientController.delete);

module.exports = router;