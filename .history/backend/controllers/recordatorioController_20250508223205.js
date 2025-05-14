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

// ✅ Eliminación de un solo recordatorio por ID o por título y fecha
exports.eliminarRecordatorio = (req, res) => {
    const recordatorioId = parseInt(req.params.id); // ✅ Asegurar que el ID es un número

    if (!recordatorioId) {
        return res.status(400).json({ mensaje: "❌ ID no proporcionado" });
    }

    console.log(`🔍 Intentando eliminar recordatorio con ID: ${recordatorioId}`);

    const sql = `DELETE FROM recordatorios WHERE id = ?`;
    db.query(sql, [recordatorioId], (err, result) => {
        if (err) {
            console.error('❌ Error al eliminar recordatorio:', err);
            return res.status(500).json({ mensaje: 'Error al eliminar el recordatorio' });
        }
        if (result.affectedRows === 0) {
            console.log(`⚠️ ID no encontrado en la base de datos: ${recordatorioId}`);
            return res.status(404).json({ mensaje: '❌ Recordatorio no encontrado' });
        }
        console.log(`🗑️ Recordatorio eliminado con ID: ${recordatorioId}`);
        return res.json({ mensaje: '✅ Recordatorio eliminado correctamente' });
    });
};


// ✅ Eliminación de todos los recordatorios de un usuario
exports.eliminarTodosPorUsuario = (req, res) => {
    const { usuario_id } = req.body;

    const sql = `DELETE FROM recordatorios WHERE usuario_id = ?`;
    db.query(sql, [usuario_id], (err, result) => {
        if (err) {
            console.error('❌ Error al eliminar todos los recordatorios:', err);
            res.status(500).json({ mensaje: 'Error al eliminar los recordatorios' });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ mensaje: '❌ No hay recordatorios para eliminar' });
        } else {
            console.log('🚮 Todos los recordatorios eliminados:', result);
            res.json({ mensaje: '✅ Todos los recordatorios eliminados correctamente' });
        }
    });
};
