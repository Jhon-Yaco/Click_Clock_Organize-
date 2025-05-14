const express = require('express');
const cors = require('cors');
const app = express();
const recordatorioRoutes = require('./routes/recordatorioRoutes');

// ⚠️ Middleware para permitir CORS
app.use(cors({
  origin: 'http://127.0.0.1:5500', // <== Esta es tu URL exacta del frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json()); // Para recibir JSON

// Rutas
app.use('/api', recordatorioRoutes);

// Iniciar servidor
const PORT = 3307;
app.listen(PORT, () => {
  console.log(`✅ Servidor backend corriendo en http://localhost:${PORT}`);
});
