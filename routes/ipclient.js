'use strict'

var express = require('express');
var IpclientController = require('../controllers/ipclient');

var router = express.Router();

var md_auth = require('../middlewares/authenticated');

//var multipart = require('connect-multiparty');
//var md_upload = multipart({ uploadDir: './uploads/users'});


//rutas de topics
router.post('/ipclient/clientdoc/:clientdocId', md_auth.authenticated, IpclientController.add);
router.delete('/ipclient/:clientdocId/:ipclientId', md_auth.authenticated, IpclientController.delete);

module.exports = router;