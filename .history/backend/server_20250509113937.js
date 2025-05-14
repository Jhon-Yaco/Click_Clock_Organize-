const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); // ✅ Permitir acceso desde cualquier origen
app.use(express.json());

// ✅ Middleware para asegurarnos de que las solicitudes llegan correctamente
app.use((req, res, next) => {
    console.log("📡 Datos recibidos en el backend:", req.body); // ✅ Registrar los datos en la terminal
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
        return res.sendStatus(200); // ✅ Responder correctamente a solicitudes OPTIONS
    }
    
    next();
});

// ✅ Configuración de rutas
const recordatorioRoutes = require('./routes/recordatorioRoutes');
app.use('/api', recordatorioRoutes);

// ✅ Arrancar servidor
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});
