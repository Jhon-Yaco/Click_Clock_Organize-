const express = require('express');
const cors = require('cors');
const app = express();

const db = require('./config/db'); // ✅ CORREGIDO
const recordatorioRoutes = require('./routes/recordatorioRoutes');

const PORT = 3307;
app.use('/api', recordatorioRoutes);
app.use(cors({
  origin: 'http://127.0.0.1:5500',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true 
}));

app.use(express.json());



app.listen(PORT, () => {
    console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});
