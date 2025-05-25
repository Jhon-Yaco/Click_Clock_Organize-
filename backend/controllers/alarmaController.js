const Alarma = require('../models/alarmaModel');
const db = require('../config/db'); // ✅ Importación agregada

// ✅ Crear una nueva alarma
exports.crearAlarma = async (req, res) => {
    console.log("📥 Datos recibidos en el backend:", req.body);

    try {
        const datos = req.body;

        // Validación básica
     if (!datos.usuario_id || !datos.hora || !Array.isArray(datos.dias) || datos.dias.length === 0) {
    return res.status(400).json({
        error: "❌ Datos incompletos: usuario_id, hora y días son obligatorios."
    });
}


        const nuevaAlarma = await Alarma.crearAlarma(datos);

exports.guardarAlarma = async (req, res) => {
    const { usuario_id, hora, activa } = req.body;

    if (!usuario_id || !hora || activa === undefined) {
        return res.status(400).json({ error: "❌ Error: Datos incompletos." });
    }

    try {
        const result = await db.execute('INSERT INTO alarmas (usuario_id, hora, activa) VALUES (?, ?, ?)', [usuario_id, hora, activa]);
        res.json({ mensaje: "✅ Alarma guardada correctamente.", alarma: req.body });
    } catch (error) {
        console.error("❌ Error en MySQL:", error);
        res.status(500).json({ error: error.message });
    }
};




        res.json({
            mensaje: "✅ Alarma guardada correctamente.",
            alarma: nuevaAlarma
        });

    } catch (error) {
        console.error("❌ Error al guardar la alarma:", error);
        res.status(500).json({ error: error.message });
    }
};

// ✅ Obtener todas las alarmas
exports.obtenerAlarmas = async (req, res) => {
    try {
        const alarmas = await Alarma.obtenerAlarmas();
        res.json(alarmas);
    } catch (error) {
        console.error("❌ Error al obtener alarmas:", error);
        res.status(500).json({ error: error.message });
    }
};

// ✅ Eliminar una alarma por ID
exports.eliminarAlarma = async (req, res) => {
    const id = req.params.id;

    if (!id) {
        return res.status(400).json({ error: "❌ ID de alarma requerido." });
    }

    console.log("🗑️ Eliminando alarma con ID:", id);

    try {
        await Alarma.eliminarAlarma(id);
        res.json({ mensaje: "✅ Alarma eliminada correctamente." });
    } catch (error) {
        console.error("❌ Error al eliminar la alarma:", error);
        res.status(500).json({ error: error.message });
    }
};




// ✅ Eliminar todas las alarmas de un usuario
exports.eliminarTodasPorUsuario = async (req, res) => {
    const usuario_id = req.params.usuario_id;
    console.log("🚮 Eliminando todas las alarmas del usuario:", usuario_id);

    if (!usuario_id) {
        return res.status(400).json({ error: "❌ Error: usuario_id es obligatorio." });
    }

    try {
        await Alarma.eliminarTodasPorUsuario(usuario_id);
        console.log("✅ Todas las alarmas eliminadas correctamente.");
        res.json({ mensaje: "✅ Todas las alarmas eliminadas." });
    } catch (error) {
        console.error("❌ Error al eliminar todas las alarmas:", error);
        res.status(500).json({ error: error.message });
    }
};


exports.actualizarEstadoAlarma = async (req, res) => {
    const alarmaId = req.params.id;
    const { activa } = req.body;

    if (!alarmaId || activa === undefined) {
        return res.status(400).json({ error: "❌ Error: Datos incompletos." });
    }

    try {
        const result = await db.execute('UPDATE alarmas SET activa = ? WHERE id = ?', [activa, alarmaId]);
        res.json({ mensaje: "✅ Estado de alarma actualizado." });
    } catch (error) {
        console.error("❌ Error en MySQL:", error);
        res.status(500).json({ error: error.message });
    }
};
