const express = require('express');
const db = require('../config/db');
const router = express.Router();

// ✅ Obtener recordatorios
router.get('/recordatorios', (req, res) => {
    db.query('SELECT * FROM recordatorios', (err, results) => {
        if (err) {
            console.error('❌ Error al obtener recordatorios:', err);
            res.status(500).json({ error: 'Error al obtener recordatorios' });
        } else {
            res.json(results);
        }
    });
});

// ✅ Agregar un recordatorio
router.post('/recordatorios', (req, res) => {
    const { usuario_id, titulo, descripcion, fecha } = req.body;
    db.query('INSERT INTO recordatorios (usuario_id, titulo, descripcion, fecha) VALUES (?, ?, ?, ?)', 
        [usuario_id, titulo, descripcion, fecha], 
        (err, results) => {
            if (err) {
                console.error('❌ Error al agregar recordatorio:', err);
                res.status(500).json({ error: 'Error al agregar recordatorio' });
            } else {
                res.json({ id: results.insertId, usuario_id, titulo, descripcion, fecha });
            }
        }
    );
});

// ✅ Eliminar un recordatorio
router.delete('/recordatorios', (req, res) => {
    const { titulo, fecha } = req.body;
    db.query('DELETE FROM recordatorios WHERE titulo = ? AND fecha = ?', [titulo, fecha], (err, results) => {
        if (err) {
            console.error('❌ Error al eliminar recordatorio:', err);
            res.status(500).json({ error: 'Error al eliminar recordatorio' });
        } else {
            res.json({ mensaje: 'Recordatorio eliminado' });
        }
    });
});

// ✅ Eliminar todos los recordatorios de un usuario
router.delete('/recordatorios/usuario', (req, res) => {
    const { usuario_id } = req.body;
    db.query('DELETE FROM recordatorios WHERE usuario_id = ?', [usuario_id], (err, results) => {
        if (err) {
            console.error('❌ Error al eliminar todos los recordatorios:', err);
            res.status(500).json({ error: 'Error al eliminar todos los recordatorios' });
        } else {
            res.json({ mensaje: 'Todos los recordatorios eliminados' });
        }
    });
});

module.exports = router;
