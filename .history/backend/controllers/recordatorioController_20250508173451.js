const db = require('../config/db');

exports.crearRecordatorio = (req, res) => {
    const { usuario_id, titulo, descripcion, fecha } = req.body;
    const sql = `INSERT INTO recordatorios (usuario_id, titulo, descripcion, fecha) VALUES (?, ?, ?, ?)`;
    
    db.query(sql, [usuario_id, titulo, descripcion, fecha], (err, result) => {
        if (err) {
            console.error('❌ Error al insertar recordatorio:', err);
            res.status(500).json({ mensaje: 'Error al guardar el recordatorio' });
        } else {
            console.log('✅ Recordatorio guardado en MySQL:', result);
            res.json({ mensaje: 'Recordatorio guardado correctamente', id: result.insertId });
        }
    });
};

exports.obtenerRecordatorios = (req, res) => {
    const sql = `SELECT * FROM recordatorios ORDER BY fecha ASC`;
    db.query(sql, (err, results) => {
        if (err) {
            console.error('❌ Error al obtener recordatorios:', err);
            res.status(500).json({ mensaje: 'Error al obtener los recordatorios' });
        } else {
            console.log('📄 Recordatorios obtenidos:', results);
            res.json(results);
        }
    });
};

exports.eliminarRecordatorio = (req, res) => {
    const recordatorioId = req.params.id; // ✅ Obtener el ID desde la URL

    if (!recordatorioId) {
        return res.status(400).json({ mensaje: "❌ ID no proporcionado" });
    }

    const sql = `DELETE FROM recordatorios WHERE id = ?`;
    db.query(sql, [recordatorioId], (err, result) => {
        if (err) {
            console.error('❌ Error al eliminar recordatorio:', err);
            res.status(500).json({ mensaje: 'Error al eliminar el recordatorio' });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ mensaje: '❌ Recordatorio no encontrado' });
        } else {
            console.log('🗑️ Recordatorio eliminado:', result);
            res.json({ mensaje: '✅ Recordatorio eliminado correctamente' });
        }
    });
};
