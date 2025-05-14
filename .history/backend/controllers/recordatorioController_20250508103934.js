const db = require('../config/db');

// Crear un nuevo recordatorio
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

// Obtener todos los recordatorios
exports.obtenerRecordatorios = (req, res) => {
  db.query('SELECT * FROM recordatorios', (error, results) => {
    if (error) {
      console.error('Error al obtener recordatorios:', error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.json(results);
  });
};

// Eliminar un solo recordatorio por usuario_id, titulo y fecha (sin id)
exports.eliminarRecordatorio = (req, res) => {
  const { usuario_id, titulo, fecha } = req.body;

  const query = 'DELETE FROM recordatorios WHERE usuario_id = ? AND titulo = ? AND fecha = ? LIMIT 1';
  db.query(query, [usuario_id, titulo, fecha], (error, results) => {
    if (error) {
      console.error('Error al eliminar recordatorio:', error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.json({ mensaje: 'Recordatorio eliminado correctamente' });
  });
};

// Eliminar todos los recordatorios de un usuario
exports.eliminarTodosPorUsuario = (req, res) => {
  const { usuario_id } = req.body;

  const query = 'DELETE FROM recordatorios WHERE usuario_id = ?';
  db.query(query, [usuario_id], (error, results) => {
    if (error) {
      console.error('Error al eliminar todos los recordatorios:', error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.json({ mensaje: 'Todos los recordatorios eliminados correctamente' });
  });
};
