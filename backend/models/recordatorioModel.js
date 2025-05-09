const db = require('./db');

async function obtenerRecordatorios() {
  const [rows] = await db.execute('SELECT * FROM recordatorios');
  return rows;
}

async function crearRecordatorio({ usuario_id, titulo, descripcion, fecha }) {
  const sql = 'INSERT INTO recordatorios (usuario_id, titulo, descripcion, fecha) VALUES (?, ?, ?, ?)';
  const [result] = await db.execute(sql, [usuario_id, titulo, descripcion || '', fecha]);
  return result.insertId;
}

module.exports = {
  obtenerRecordatorios,
  crearRecordatorio
};
