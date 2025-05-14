const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());

// ✅ Configuración correcta de CORS
app.use(cors({
    origin: 'http://127.0.0.1:5500', // ✅ Permitir SOLO este origen
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

// ✅ Middleware manual para asegurarnos de que CORS permite las solicitudes
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

// ✅ Configuración de rutas
const recordatorioRoutes = require('./routes/recordatorioRoutes');
app.use('/api', recordatorioRoutes);

// ✅ Arrancar servidor
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
