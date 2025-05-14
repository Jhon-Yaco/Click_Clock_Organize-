const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    port: '3307', // ✅ Ajustar al puerto correcto
    user: 'root', // Reemplaza con tu usuario real de MySQL
    password: 'Sena_1', // Reemplaza con tu contraseña
    database: 'click_clock'
});

db.connect(err => {
    if (err) {
        console.error('❌ Error de conexión a MySQL:', err);
        return;
    }
    console.log('✅ Conectado a MySQL correctamente.');
});

module.exports = db;
