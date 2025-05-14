const express = require('express');
const router = express.Router();
const recordatorioController = require('../controllers/recordatorioController');

router.post('/recordatorio', recordatorioController.crearRecordatorio);
router.get('/recordatorio', recordatorioController.obtenerRecordatorios);
router.delete('/recordatorio', recordatorioController.eliminarRecordatorios);

module.exports = router;
