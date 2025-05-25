const express = require('express');
const router = express.Router();
const alarmaController = require('../controllers/alarmaController');

router.get('/', alarmaController.obtenerAlarmas);
router.post('/', alarmaController.crearAlarma);
router.delete('/usuario/:usuario_id', alarmaController.eliminarTodasPorUsuario); // ✅ Ruta específica para eliminar TODAS las alarmas de un usuario
router.delete('/:id', alarmaController.eliminarAlarma); // ✅ Ruta para eliminar una alarma individual

module.exports = router;
