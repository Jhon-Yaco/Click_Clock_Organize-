const express = require('express');
const cors = require('cors');
const app = express();
const recordatorioRoutes = require('./routes/recordatorioRoutes');

// ⚠️ Middleware para permitir CORS correctamente
app.use(cors({
    origin: 'http://127.0.0.1:5500', // URL de tu frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: false // Cambié a `false` para evitar conflictos en algunos navegadores
}));

app.use(express.json()); // Middleware para procesar JSON correctamente

// Rutas
app.use('/api', recordatorioRoutes);

// Iniciar servidor
const PORT = 5000; // ⚠️ Cambié el puerto para evitar conflictos con otros procesos
app.listen(PORT, () => {
    console.log(`✅ Servidor backend corriendo en http://localhost:${PORT}`);
});
