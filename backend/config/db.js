const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Sena_1',
    database: 'click_clock',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 📌 Verificar conexión inicial y capturar errores
db.getConnection()
    .then(connection => {
        console.log('✅ Conectado a MySQL correctamente.');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Error de conexión a MySQL:', err);
        process.exit(1); // 📌 Detener el servidor si la conexión falla
    });

module.exports = db;
