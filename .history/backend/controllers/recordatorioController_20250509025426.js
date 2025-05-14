const express = require('express');
const router = express.Router();

// Simulación de una base de datos en memoria
let recordatorios = [];

// 📌 Obtener todos los recordatorios
router.get('/recordatorios', (req, res) => {
    res.json(recordatorios);
});

// 📌 Agregar un nuevo recordatorio
router.post('/recordatorios', (req, res) => {
    const { usuario_id, titulo, descripcion, fecha } = req.body;

    if (!usuario_id || !titulo || !fecha) {
        return res.status(400).json({ error: "Faltan datos requeridos." });
    }

    const nuevoRecordatorio = { id: recordatorios.length + 1, usuario_id, titulo, descripcion, fecha };
    recordatorios.push(nuevoRecordatorio);
    
    res.status(201).json(nuevoRecordatorio);
});

// 📌 Eliminar un recordatorio por título y fecha
router.delete('/recordatorios', (req, res) => {
    const { titulo, fecha } = req.body;

    recordatorios = recordatorios.filter(r => r.titulo !== titulo || r.fecha !== fecha);
    
    res.json({ mensaje: "Recordatorio eliminado correctamente." });
});

// 📌 Eliminar todos los recordatorios de un usuario
router.delete('/recordatorios/usuario', (req, res) => {
    const { usuario_id } = req.body;

    if (!usuario_id) {
        return res.status(400).json({ error: "Falta el usuario_id." });
    }

    recordatorios = recordatorios.filter(r => r.usuario_id !== usuario_id);
    res.json({ mensaje: "Todos los recordatorios eliminados." });
});

module.exports = router;
