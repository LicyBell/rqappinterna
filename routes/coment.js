'use strict'

var express = require('express');
var ComentController = require('../controllers/coment');

var router = express.Router();

var md_auth = require('../middlewares/authenticated');

//var multipart = require('connect-multiparty');
//var md_upload = multipart({ uploadDir: './uploads/users'});


//rutas de topics
router.post('/coment/topic/:topicId', md_auth.authenticated, ComentController.add);
router.put('/coment/:comentId', md_auth.authenticated, ComentController.update);
router.delete('/coment/:topicId/:comentId', md_auth.authenticated, ComentController.delete);

module.exports = router;