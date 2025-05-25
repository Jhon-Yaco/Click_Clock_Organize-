const Alarma = require('../models/alarmaModel');

exports.crearAlarma = async (req, res) => {
    console.log("📥 Datos recibidos en el backend:", req.body);
    try {
        const id = await Alarma.crearAlarma(req.body);
        res.json({ mensaje: "✅ Alarma guardada correctamente.", id });
    } catch (error) {
        console.error("❌ Error al guardar la alarma:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.obtenerAlarmas = async (req, res) => {
    try {
        const alarmas = await Alarma.obtenerAlarmas();
        res.json(alarmas);
    } catch (error) {
        console.error("❌ Error al obtener alarmas:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.eliminarAlarma = async (req, res) => {
    console.log("🗑️ Eliminando alarma:", req.params.id);
    try {
        await Alarma.eliminarAlarma(req.params.id);
        res.json({ mensaje: "✅ Alarma eliminada correctamente." });
    } catch (error) {
        console.error("❌ Error al eliminar alarma:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.eliminarTodasPorUsuario = async (req, res) => {
    console.log("🚮 Eliminando todas las alarmas del usuario:", req.params.usuario_id);
    try {
        await Alarma.eliminarTodasPorUsuario(req.params.usuario_id);
        res.json({ mensaje: "✅ Todas las alarmas han sido eliminadas." });
    } catch (error) {
        console.error("❌ Error al eliminar todas las alarmas:", error);
        res.status(500).json({ error: error.message });
    }
};
