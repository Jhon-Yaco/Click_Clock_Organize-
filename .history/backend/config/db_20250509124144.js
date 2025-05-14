const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',  // Ajustar si el servidor MySQL está en otro lugar
    port: '3307',
    user: 'root', // Reemplaza con tu usuario de MySQL
    password: 'Sena_1', // Reemplaza con tu contraseña
    database: 'click_clock'
});

db.connect(err => {
    if (err) {
        console.error('❌ Error de conexión a MySQL:', err);
        return;
    }
    console.log('✅ Conectado a MySQL Workbench correctamente.');
});

module.exports = db;
