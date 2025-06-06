const express = require('express');
const cors = require('cors');
const app = express();

const db = require('./config/db'); // ✅ CORREGIDO
const recordatorioRoutes = require('./routes/recordatorioRoutes');

const PORT = 3307;

app.use(cors({
  origin: 'http://127.0.0.1:5500'
}));

app.use(express.json());

app.use('/api/recordatorios', recordatorioRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});
