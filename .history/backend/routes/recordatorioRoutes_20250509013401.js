const express = require('express');
const cors = require('cors');
const router = express.Router();
const recordatorioController = require('../controllers/recordatorioController');

// ⚠️ Aplicar CORS dentro de las rutas por si hay conflictos
router.use(cors({
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

router.post('/recordatorios', recordatorioController.crearRecordatorio);
router.get('/recordatorios', recordatorioController.obtenerRecordatorios);
router.delete('/recordatorios', recordatorioController.eliminarRecordatorio);
router.delete('/recordatorios/usuario', recordatorioController.eliminarTodosPorUsuario);

module.exports = router;
