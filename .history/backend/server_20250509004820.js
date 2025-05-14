const db = require('../config/db'); // Importa la conexión a MySQL

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
