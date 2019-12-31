'use strict'

var express = require('express');
var mailclientController = require('../controllers/mailclient');

var router = express.Router();

var md_auth = require('../middlewares/authenticated');

//var multipart = require('connect-multiparty');
//var md_upload = multipart({ uploadDir: './uploads/users'});


//rutas de topics
router.post('/mailclient/clientdoc/:clientdocId', md_auth.authenticated, mailclientController.add);
router.delete('/mailclient/:clientdocId/:mailclientId', md_auth.authenticated, mailclientController.delete);

module.exports = router;