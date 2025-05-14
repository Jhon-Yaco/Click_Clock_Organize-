const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());

// ✅ Configurar CORS para permitir cualquier origen del frontend
app.use(cors());

// ✅ Middleware manual para garantizar el acceso
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // ✅ Permitir cualquier origen
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
        return res.sendStatus(200); // ✅ Responder correctamente a solicitudes OPTIONS
    }

    console.log("📡 Datos recibidos en el backend:", req.body); // ✅ Verificación de datos recibidos

    next();
});

// ✅ Configuración de rutas
const recordatorioRoutes = require('./routes/recordatorioRoutes');
app.use('/api', recordatorioRoutes);

// ✅ Arrancar servidor
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
