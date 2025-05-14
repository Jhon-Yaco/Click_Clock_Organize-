// backend/controller/recordatorioController.js

const db = require('../config/db');

// Obtener todos los recordatorios de un usuario
exports.obtenerRecordatorios = (req, res) => {
  const { usuario_id } = req.params;

  const sql = 'SELECT * FROM recordatorios WHERE usuario_id = ?';
  db.query(sql, [usuario_id], (err, resultados) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener recordatorios' });
    }
    res.json(resultados);
  });
};

// Crear un nuevo recordatorio
exports.crearRecordatorio = (req, res) => {
  const { usuario_id, titulo, descripcion, fecha } = req.body;

  const sql = 'INSERT INTO recordatorios (usuario_id, titulo, descripcion, fecha) VALUES (?, ?, ?, ?)';
  db.query(sql, [usuario_id, titulo, descripcion, fecha], (err, resultado) => {
    if (err) {
      return res.status(500).json({ error: 'Error al crear recordatorio' });
    }
    res.json({ mensaje: 'Recordatorio creado', id: resultado.insertId });
  });
};

// Eliminar un recordatorio
exports.eliminarRecordatorio = (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM recordatorios WHERE id = ?';
  db.query(sql, [id], (err, resultado) => {
    if (err) {
      return res.status(500).json({ error: 'Error al eliminar recordatorio' });
    }
    res.json({ mensaje: 'Recordatorio eliminado' });
  });
};

// Actualizar un recordatorio
exports.actualizarRecordatorio = (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, fecha } = req.body;

  const sql = 'UPDATE recordatorios SET titulo = ?, descripcion = ?, fecha = ? WHERE id = ?';
  db.query(sql, [titulo, descripcion, fecha, id], (err, resultado) => {
    if (err) {
      return res.status(500).json({ error: 'Error al actualizar recordatorio' });
    }
    res.json({ mensaje: 'Recordatorio actualizado' });
  });
};
