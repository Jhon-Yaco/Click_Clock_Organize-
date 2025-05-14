const db = require('../config/db');

// Crear un nuevo recordatorio
const crearRecordatorio = (req, res) => {
    const { mensaje, fecha, hora } = req.body;
    const sql = 'INSERT INTO recordatorios (mensaje, fecha, hora) VALUES (?, ?, ?)';

    db.query(sql, [mensaje, fecha, hora], (err, result) => {
        if (err) {
            console.error('Error al insertar recordatorio:', err);
            res.status(500).json({ error: 'Error al insertar recordatorio' });
        } else {
            res.status(200).json({ mensaje: 'Recordatorio guardado exitosamente' });
        }
    });
};

// Obtener todos los recordatorios
const obtenerRecordatorios = (req, res) => {
    db.query('SELECT * FROM recordatorios', (err, results) => {
        if (err) {
            console.error('Error al obtener recordatorios:', err);
            res.status(500).json({ error: 'Error al obtener recordatorios' });
        } else {
            res.status(200).json(results);
        }
    });
};

// Eliminar todos los recordatorios
const eliminarRecordatorios = (req, res) => {
    db.query('DELETE FROM recordatorios', (err, result) => {
        if (err) {
            console.error('Error al eliminar recordatorios:', err);
            res.status(500).json({ error: 'Error al eliminar recordatorios' });
        } else {
            res.status(200).json({ mensaje: 'Todos los recordatorios han sido eliminados' });
        }
    });
};

module.exports = {
    crearRecordatorio,
    obtenerRecordatorios,
    eliminarRecordatorios
};
