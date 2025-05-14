const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',  
    user: 'root',
    password: 'Sena_1',
    database: 'click_clock',
    multipleStatements: true // ✅ Permite ejecutar múltiples consultas si es necesario
});

db.connect(err => {
    if (err) {
        console.error('❌ Error de conexión a MySQL:', err);
        return;
    }
    console.log('✅ Conectado a MySQL correctamente.');
});

module.exports = db;
