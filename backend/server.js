const express = require('express');
const cors = require('cors');
const mysql = require('mysql'); 
const alarmaRoutes = require('./routes/alarmaRoutes'); // ✅ Importado correctamente

const app = express();
app.use(express.json());

// ✅ Configuración de CORS
app.use(cors({
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type']
}));

// ✅ Conexión a la base de datos MySQL (ahora antes de registrar rutas)
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Sena_1', 
    database: 'click_clock'
});

db.connect(err => {
    if (err) {
        console.error('❌ Error al conectar a MySQL:', err);
        process.exit(1);
    }
    console.log("✅ Conectado a la base de datos MySQL.");
});

// ✅ Middleware de seguridad y control de solicitudes
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }

    console.log("📡 Datos recibidos en el backend:", req.body);
    next();
});

// ✅ Registro de rutas (ahora antes de rutas individuales)
app.use('/api/alarmas', alarmaRoutes);

// ✅ Rutas para RECORDATORIOS
app.get('/api/recordatorios', (req, res) => {
    db.query('SELECT * FROM recordatorios', (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al obtener recordatorios' });
        res.json(results);
    });
});

app.post('/api/recordatorios', (req, res) => {
    const { usuario_id, titulo, fecha } = req.body;
    db.query('INSERT INTO recordatorios (usuario_id, titulo, fecha) VALUES (?, ?, ?)', 
        [usuario_id, titulo, fecha], 
        (err, result) => {
            if (err) return res.status(500).json({ error: 'Error al agregar recordatorio' });
            res.json({ id: result.insertId, usuario_id, titulo, fecha });
        }
    );
});

app.delete('/api/recordatorios/:id', (req, res) => {
    db.query('DELETE FROM recordatorios WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: 'Error al eliminar el recordatorio' });
        res.json({ message: '✅ Recordatorio eliminado correctamente' });
    });
});

app.delete('/api/recordatorios/usuario/:usuario_id', (req, res) => {
    db.query('DELETE FROM recordatorios WHERE usuario_id = ?', [req.params.usuario_id], (err) => {
        if (err) return res.status(500).json({ error: 'Error al eliminar todos los recordatorios' });
        res.json({ message: '✅ Todos los recordatorios eliminados correctamente' });
    });
});

// ✅ Verificación final de rutas activas
setTimeout(() => {
    console.log("🔍 Listando rutas activas...");
    if (app._router && app._router.stack) {
        app._router.stack.forEach((middleware) => {
            if (middleware.route) {
                console.log(`✅ Método: ${Object.keys(middleware.route.methods).join(", ").toUpperCase()} | Ruta: ${middleware.route.path}`);
            }
        });
    } else {
        console.warn("⚠️ No hay rutas definidas para mostrar");
    }
}, 1000);

// ✅ Iniciar servidor
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
