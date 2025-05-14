const express = require('express');
const cors = require('cors');
const recordatorioController = require('../controllers/recordatorioController');

const router = express.Router();
router.use(cors({
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

router.post('/recordatorios', recordatorioController.crearRecordatorio);
router.get('/recordatorios', recordatorioController.obtenerRecordatorios);
router.delete('/recordatorios/:id', recordatorioController.eliminarRecordatorio);
router.delete('/recordatorios/usuario', recordatorioController.eliminarTodosPorUsuario);

module.exports = router;
