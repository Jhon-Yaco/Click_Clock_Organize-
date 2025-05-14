exports.crearRecordatorio = (req, res) => {
    console.log("Datos recibidos en el backend:", req.body); // ⚠️ Verificación de datos
    res.json({ mensaje: "✅ Recordatorio guardado correctamente." });
};

exports.obtenerRecordatorios = (req, res) => {
    res.json({ mensaje: "📄 Aquí están los recordatorios." });
};

exports.eliminarRecordatorio = (req, res) => {
    console.log("Eliminando recordatorio:", req.body);
    res.json({ mensaje: "🗑️ Recordatorio eliminado correctamente." });
};

exports.eliminarTodosPorUsuario = (req, res) => {
    console.log("Eliminando todos los recordatorios del usuario:", req.body.usuario_id);
    res.json({ mensaje: "🚮 Todos los recordatorios eliminados." });
};
