const express = require('express');
const cors = require('cors');
const app = express();

// ⚠️ Muy importante: CORS correctamente configurado
app.use(cors({
  origin: 'http://127.0.0.1:5500', // O usa '*' si no te importa la seguridad
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());

// Tus rutas
const recordatorioRoutes = require('./routes/recordatorioRoutes');
app.use('/api', recordatorioRoutes);

// Arrancar servidor
const PORT = 3307;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
