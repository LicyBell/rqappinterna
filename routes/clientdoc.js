'use strict'

var express = require('express');
var ClientdocController = require('../controllers/clientdoc');

var router = express.Router();

var md_auth = require('../middlewares/authenticated');

//var multipart = require('connect-multiparty');
//var md_upload = multipart({ uploadDir: './uploads/users'});


//rutas de topics

router.post('/clientdoc', md_auth.authenticated, ClientdocController.save);
router.get('/clientdocs', ClientdocController.getClientDocs);
router.delete('/clientdoc/:id', md_auth.authenticated, ClientdocController.delete);
router.get('/clientdoc/:id', ClientdocController.getClientDoc);
router.put('/clientdoc/:id', md_auth.authenticated, ClientdocController.update);
router.get('/clientdocsearch/:search', ClientdocController.search);
router.get('/clientdocinf/:Idsistemaadmin',  ClientdocController.getClientDocUsuario);

module.exports = router;