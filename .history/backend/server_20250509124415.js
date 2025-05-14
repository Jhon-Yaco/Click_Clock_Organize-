const express = require('express');
const cors = require('cors');
const app = express();

const allowedOrigins = ['http://127.0.0.1:5500', 'http://127.0.0.1:5501'];

app.use(cors({
    origin: allowedOrigins, // ✅ Permitir ambos puertos del frontend
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

app.use((req, res, next) => {
    console.log("📡 Datos recibidos en el backend:", req.body); // ✅ Verifica lo que recibe
    next();
}); 

app.use((req, res, next) => {
    const origin = req.headers.origin;
    
    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    
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

// ✅ Arrancar servidor
const PORT = 5000;
app.listen(5000, () => {
    console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});
