const express = require('express');
const cors = require('cors');
const router = express.Router();

router.use(cors({
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

router.post('/recordatorios', (req, res) => {
    res.json({ mensaje: "Recordatorio guardado correctamente" });
});

module.exports = router;
