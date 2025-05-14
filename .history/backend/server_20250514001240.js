const express = require('express');
const cors = require('cors');
const mysql = require('mysql'); // ✅ Se agregó la importación correcta

const app = express();
app.use(express.json());

// ✅ Configuración de CORS
app.use(cors({
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

// ✅ Conexión a la base de datos MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Cambia si tienes otro usuario en MySQL
    password: '', // Dejar vacío si no tienes contraseña
    database: 'click_clock'
});

db.connect(err => {
    if (err) {
        console.error('❌ Error al conectar a MySQL:', err);
        process.exit(1); // ✅ Detener el servidor si hay error en la conexión
    }
    console.log("✅ Conectado a la base de datos MySQL.");
});

// ✅ Middleware para verificar solicitudes
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }

    console.log("📡 Datos recibidos en el backend:", req.body);
    next();
});

// ✅ Ruta para obtener recordatorios
app.get('/api/recordatorios', (req, res) => {
    db.query('SELECT * FROM recordatorios', (err, results) => {
        if (err) {
            console.error('❌ Error al obtener recordatorios:', err);
            res.status(500).json({ error: 'Error al obtener recordatorios' });
        } else {
            res.json(results);
        }
    });
});

// ✅ Ruta para agregar un recordatorio
app.post('/api/recordatorios', (req, res) => {
    const { usuario_id, titulo, fecha } = req.body;
    db.query('INSERT INTO recordatorios (usuario_id, titulo, fecha) VALUES (?, ?, ?)', 
        [usuario_id, titulo, fecha], 
        (err, result) => {
            if (err) {
                console.error('❌ Error al agregar recordatorio:', err);
                res.status(500).json({ error: 'Error al agregar recordatorio' });
            } else {
                res.json({ id: result.insertId, usuario_id, titulo, fecha });
            }
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

// ✅ Arrancar servidor
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
