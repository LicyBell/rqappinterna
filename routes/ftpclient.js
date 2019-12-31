'use strict'

var express = require('express');
var ftpclientController = require('../controllers/ftpclient');

var router = express.Router();

var md_auth = require('../middlewares/authenticated');

//var multipart = require('connect-multiparty');
//var md_upload = multipart({ uploadDir: './uploads/users'});


//rutas de topics
router.post('/ftpclient/clientdoc/:clientdocId', md_auth.authenticated, ftpclientController.add);
router.delete('/ftpclient/:clientdocId/:ftpclientId', md_auth.authenticated, ftpclientController.delete);

module.exports = router;