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
    const { titulo, fecha } = req.body; // ✅ Recibir título y fecha

    if (!titulo || !fecha) {
        return res.status(400).json({ mensaje: "❌ Título y fecha son obligatorios para eliminar el recordatorio." });
    }

    console.log(`🔍 Intentando eliminar recordatorio: ${titulo} - ${fecha}`);

    // ✅ Aseguramos que la fecha tenga el mismo formato que MySQL espera
    const sql = `DELETE FROM recordatorios WHERE titulo = ? AND fecha = ?`;
    db.query(sql, [titulo, new Date(fecha).toISOString().slice(0, 19).replace('T', ' ')], (err, result) => {
        if (err) {
            console.error('❌ Error al eliminar recordatorio:', err);
            return res.status(500).json({ mensaje: 'Error al eliminar el recordatorio' });
        }
        if (result.affectedRows === 0) {
            console.log(`⚠️ No se encontró el recordatorio con título: ${titulo} y fecha: ${fecha}`);
            return res.status(404).json({ mensaje: '❌ Recordatorio no encontrado' });
        }

        console.log(`🗑️ Recordatorio eliminado de la base de datos: ${titulo} - ${fecha}`);
        return res.json({ mensaje: '✅ Recordatorio eliminado correctamente' });
    });
};




// ✅ Eliminación de todos los recordatorios de un usuario
exports.eliminarRecordatorio = (req, res) => {
    const { titulo, fecha } = req.body;

    if (!titulo || !fecha) {
        return res.status(400).json({ mensaje: "❌ Título y fecha son obligatorios para eliminar el recordatorio." });
    }

    console.log(`🔍 Intentando eliminar recordatorio: ${titulo} - ${fecha}`);

    const sql = `DELETE FROM recordatorios WHERE titulo = ? AND fecha = ?`;
    db.query(sql, [titulo, new Date(fecha).toISOString().slice(0, 19).replace('T', ' ')], (err, result) => {
        if (err) {
            console.error('❌ Error al eliminar recordatorio:', err);
            return res.status(500).json({ mensaje: 'Error al eliminar el recordatorio' });
        }
        if (result.affectedRows === 0) {
            console.log(`⚠️ No se encontró el recordatorio con título: ${titulo} y fecha: ${fecha}`);
            return res.status(404).json({ mensaje: '❌ Recordatorio no encontrado' });
        }

        console.log(`🗑️ Recordatorio eliminado de la base de datos: ${titulo} - ${fecha}`);
        return res.json({ mensaje: '✅ Recordatorio eliminado correctamente' });
    });
};

