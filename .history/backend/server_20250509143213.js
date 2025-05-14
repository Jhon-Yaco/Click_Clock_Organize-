const express = require('express');
const cors = require('cors');
const app = express();

const allowedOrigins = ['http://127.0.0.1:5500', 'http://127.0.0.1:5501'];

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// ✅ Middleware para imprimir datos recibidos
app.use((req, res, next) => {
    console.log("📡 Datos recibidos en el backend:", req.body);
    next();
});

const recordatorioRoutes = require('./routes/recordatorioRoutes');
app.use('/api', recordatorioRoutes);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
