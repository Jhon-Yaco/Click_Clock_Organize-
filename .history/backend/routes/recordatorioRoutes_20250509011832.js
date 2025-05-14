const express = require('express');
const cors = require('cors');
const recordatorioController = require('../controllers/recordatorioController');

const router = express.Router();
router.use(cors());

router.post('/recordatorios', recordatorioController.crearRecordatorio);
router.get('/recordatorios', recordatorioController.obtenerRecordatorios);
router.delete('/recordatorios', recordatorioController.eliminarRecordatorio);
router.delete('/recordatorios/usuario', recordatorioController.eliminarTodosPorUsuario);

module.exports = router;
