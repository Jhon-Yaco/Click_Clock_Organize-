const express = require('express');

// Simulación de una base de datos
let recordatorios = [];

// 📌 **Obtener todos los recordatorios**
const obtenerRecordatorios = (req, res) => {
    res.json(recordatorios);
};

// 📌 **Crear un nuevo recordatorio (POST)**
const crearRecordatorio = (req, res) => {
    const { usuario_id, titulo, descripcion, fecha } = req.body;

    if (!usuario_id || !titulo || !fecha) {
        return res.status(400).json({ error: "❌ Faltan datos requeridos." });
    }

    const nuevoRecordatorio = { id: recordatorios.length + 1, usuario_id, titulo, descripcion, fecha };
    recordatorios.push(nuevoRecordatorio);

    res.status(201).json({ mensaje: "✅ Recordatorio creado correctamente.", recordatorio: nuevoRecordatorio });
};

// 📌 **Eliminar un recordatorio por ID (DELETE)**
const eliminarRecordatorio = (req, res) => {
    const { id } = req.params;
    const idNumerico = parseInt(id, 10);

    if (isNaN(idNumerico)) {
        return res.status(400).json({ error: "❌ ID no válido." });
    }

    const recordatorioIndex = recordatorios.findIndex(r => r.id === idNumerico);
    
    if (recordatorioIndex === -1) {
        return res.status(404).json({ error: "❌ Recordatorio no encontrado." });
    }

    recordatorios.splice(recordatorioIndex, 1);
    res.json({ mensaje: "🗑️ Recordatorio eliminado correctamente." });
};

// 📌 **Eliminar todos los recordatorios de un usuario (DELETE)**
const eliminarTodosPorUsuario = (req, res) => {
    const { usuario_id } = req.body;

    if (!usuario_id) {
        return res.status(400).json({ error: "❌ Se requiere usuario_id." });
    }

    recordatorios = recordatorios.filter(r => r.usuario_id !== usuario_id);
    res.json({ mensaje: "🗑️ Todos los recordatorios del usuario fueron eliminados." });
};

module.exports = {
    obtenerRecordatorios,
    crearRecordatorio,
    eliminarRecordatorio,
    eliminarTodosPorUsuario
};
