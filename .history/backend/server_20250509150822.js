const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); // ✅ Permitir acceso sin restricciones
app.use(express.json());

// ✅ Middleware para imprimir datos recibidos y configurar CORS
app.use((req, res, next) => {
    console.log("📡 Datos recibidos en el backend:", req.body);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    
    next();
});

// ✅ Configuración de rutas
const recordatorioRoutes = require('./routes/recordatorioRoutes');
app.use('/api', recordatorioRoutes);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
