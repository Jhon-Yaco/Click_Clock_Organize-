const express = require('express');
const cors = require('cors');
const db = require('./config/db'); // Importa la conexión a MySQL
const recordatorioRoutes = require('./routes/recordatorioRoutes');

const app = express();

// ⚠️ Configuración de CORS para permitir comunicación con el frontend
app.use(cors({
    origin: 'http://127.0.0.1:5500', // URL del frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(express.json()); // Middleware para procesar JSON correctamente

// Rutas
app.use('/api', recordatorioRoutes);

// Iniciar servidor
const PORT = 5000; // Asegurar que el puerto no tenga conflictos
app.listen(PORT, () => {
    console.log(`✅ Servidor backend corriendo en http://localhost:${PORT}`);
});
