const express = require('express');
const router = express.Router();
const recordatorioController = require('../controllers/recordatorioController');

router.post('/recordatorios', recordatorioController.crearRecordatorio);
router.get('/recordatorios', recordatorioController.obtenerRecordatorios);
router.delete('/recordatorios', recordatorioController.eliminarRecordatorios);

module.exports = router;
