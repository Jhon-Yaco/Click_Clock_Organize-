const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Cambia si tienes otro usuario en MySQL
    password: '', // Dejar vacío si no tienes contraseña
    database: 'click_clock'
});

db.connect(err => {
    if (err) throw err;
    console.log("✅ Conectado a la base de datos MySQL.");
});

// ✅ Ruta para obtener recordatorios
app.get('/api/recordatorios', (req, res) => {
    db.query('SELECT * FROM recordatorios', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// ✅ Ruta para agregar recordatorios
app.post('/api/recordatorios', (req, res) => {
    const { usuario_id, titulo, fecha } = req.body;
    db.query('INSERT INTO recordatorios (usuario_id, titulo, fecha) VALUES (?, ?, ?)', 
        [usuario_id, titulo, fecha], 
        (err, result) => {
            if (err) throw err;
            res.json({ id: result.insertId, usuario_id, titulo, fecha });
        }
    );
});

// ✅ Ruta para eliminar un recordatorio por ID
app.delete('/api/recordatorios/:id', (req, res) => {
    const recordatorioId = req.params.id;
    db.query('DELETE FROM recordatorios WHERE id = ?', [recordatorioId], (err, result) => {
        if (err) {
            console.error('❌ Error al eliminar el recordatorio:', err);
            res.status(500).json({ error: 'Error al eliminar el recordatorio' });
        } else {
            res.json({ message: '✅ Recordatorio eliminado correctamente' });
        }
    });
});

// ✅ Ruta para eliminar todos los recordatorios de un usuario
app.delete('/api/recordatorios/usuario', (req, res) => {
    const { usuario_id } = req.body;
    db.query('DELETE FROM recordatorios WHERE usuario_id = ?', [usuario_id], (err, result) => {
        if (err) {
            console.error('❌ Error al eliminar todos los recordatorios:', err);
            res.status(500).json({ error: 'Error al eliminar todos los recordatorios' });
        } else {
            res.json({ message: '✅ Todos los recordatorios eliminados correctamente' });
        }
    });
});

// ✅ Iniciar servidor
app.listen(5000, () => console.log("🚀 Servidor corriendo en http://localhost:5000"));
