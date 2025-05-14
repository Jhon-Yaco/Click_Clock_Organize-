const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://127.0.0.1:5501'],
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

app.use((req, res, next) => {
    const allowedOrigins = ['http://127.0.0.1:5500', 'http://127.0.0.1:5501'];
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
    }

    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE");
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
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
