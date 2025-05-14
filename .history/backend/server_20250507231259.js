const express = require('express');
const cors = require('cors');
const app = express();
const recordatorioRoutes = require('./routes/recordatorioRoutes');

// ✅ Configurar CORS globalmente para permitir el acceso desde tu frontend local
app.use(cors({
  origin: 'http://127.0.0.1:5500', // Cambia esto si tu frontend está en otro puerto
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));

// Middleware para parsear JSON
app.use(express.json());

// Rutas API
app.use('/api', recordatorioRoutes);

// Puerto del backend
const PORT = 3307;
app.listen(PORT, () => {
  console.log(`✅ Servidor backend corriendo en http://localhost:${PORT}`);
});
