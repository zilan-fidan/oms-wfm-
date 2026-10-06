require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

async function testConnection() {
    try {
        const result = await pool.query('SELECT NOW()');
        console.log('PostgreSQL bağlantısı başarılı');
        console.log('Database zamanı:', result.rows[0].now);

    } catch (error) {
        console.error('PostgreSQL bağlantı hatası:',error);
    }
}

module.exports = {
    pool,
    testConnection
};