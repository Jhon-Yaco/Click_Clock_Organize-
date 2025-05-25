const db = require('../config/db');


async function obtenerAlarmas() {
    const [rows] = await db.execute('SELECT * FROM alarmas');
    return rows;
}

async function crearAlarma({ usuario_id, hora, dias, activa }) {
    if (!usuario_id || !hora || !dias || dias.length === 0) {
        throw new Error("❌ Datos incompletos: usuario_id, hora y días son obligatorios.");
    }

    const diasString = Array.isArray(dias) ? dias.join(",") : dias;
    const sql = 'INSERT INTO alarmas (usuario_id, hora, dia_semana, activa) VALUES (?, ?, ?, ?)';

    try {
        const [result] = await db.execute(sql, [usuario_id, hora, diasString, activa ? 1 : 0]);
        return { id: result.insertId, usuario_id, hora, dias: diasString, activa };
    } catch (error) {
        console.error("❌ Error en MySQL:", error.message);
        throw new Error(`❌ Error en la base de datos: ${error.message}`);
    }
}

async function eliminarAlarma(id) {
    const query = 'DELETE FROM alarmas WHERE id = ?';
    await db.query(query, [id]);
}

async function eliminarTodasPorUsuario(usuario_id) {
    const sql = 'DELETE FROM alarmas WHERE usuario_id = ?';
    await db.execute(sql, [usuario_id]);
}

exports.eliminarTodasPorUsuario = async (usuario_id) => {
    const [result] = await db.execute('DELETE FROM alarmas WHERE usuario_id = ?', [usuario_id]);
    return result;
};
module.exports = {
    obtenerAlarmas,
    crearAlarma,
    eliminarAlarma,
    eliminarTodasPorUsuario
};
