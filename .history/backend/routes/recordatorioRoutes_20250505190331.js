const express = require('express');
const router = express.Router();
const recordatorioController = require('../controller/recordatorioController');

// Crear recordatorio
router.post('/', recordatorioController.crearRecordatorio);

// Obtener recordatorios
router.get('/:usuario_id', recordatorioController.obtenerRecordatorios);

// Eliminar recordatorio
router.delete('/:id', recordatorioController.eliminarRecordatorio);

module.exports = router;
