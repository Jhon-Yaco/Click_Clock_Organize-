const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log("📡 Datos recibidos en el backend:", req.body); // ✅ Verificar datos en la terminal
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }

    next();
});

const recordatorioRoutes = require('./routes/recordatorioRoutes');
app.use('/api', recordatorioRoutes);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});
