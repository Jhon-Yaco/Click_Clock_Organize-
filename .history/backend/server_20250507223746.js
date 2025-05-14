const express = require('express');
const cors = require('cors');
const app = express();

const recordatorioRoutes = require('./routes/recordatorioRoutes');

const PORT = 3307;

// ✅ Middleware CORS global sin restricciones (solo para desarrollo)
app.use(cors());

app.use(express.json());
app.use('/api', recordatorioRoutes);

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
