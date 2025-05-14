// controllers/recordatorioController.js
const db = require('../config/db');

exports.crearRecordatorio = (req, res) => {
  const { usuario_id, titulo, descripcion, fecha } = req.body;

  const query = 'INSERT INTO recordatorios (usuario_id, titulo, descripcion, fecha) VALUES (?, ?, ?, ?)';
  db.query(query, [usuario_id, titulo, descripcion, fecha], (error, results) => {
    if (error) {
      console.error('Error al crear recordatorio:', error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.status(201).json({ mensaje: 'Recordatorio creado correctamente' });
  });
};

exports.obtenerRecordatorios = (req, res) => {
  db.query('SELECT * FROM recordatorios', (error, results) => {
    if (error) {
      console.error('Error al obtener recordatorios:', error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.json(results);
  });
};

exports.eliminarRecordatorios = (req, res) => {
  const { id } = req.body;

  db.query('DELETE FROM recordatorios WHERE id = ?', [id], (error, results) => {
    if (error) {
      console.error('Error al eliminar recordatorio:', error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.json({ mensaje: 'Recordatorio eliminado correctamente' });
  });
};
