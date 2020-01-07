'use strict'

var express = require('express');
var NotaController = require('../controllers/nota');

var router = express.Router();

var md_auth = require('../middlewares/authenticated');


//rutas de prueba
router.get('/notas/test', NotaController.test);


//rutas de topics
router.post('/nota', md_auth.authenticated, NotaController.save);
router.get('/notas', NotaController.getNotas);
router.get('/user-notas/:user', NotaController.getNotasByUser);
router.get('/nota/:id', NotaController.getNota);
router.put('/nota/:id', md_auth.authenticated, NotaController.update);
router.delete('/nota/:id', md_auth.authenticated, NotaController.delete);
router.get('/notasearch/:search', NotaController.search);


module.exports = router;