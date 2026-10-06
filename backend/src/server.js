const express = require('express');
const cors = require('cors');
const {pool, testConnection} = require('./config/database');
const outageRoutes = require('./routes/outage.routes');
const app = express();
const PORT = 3003;
app.use(cors());
app.use(express.json());
testConnection();

app.get('/', (req, res) => {res.send('OMS-WFM API çalışıyor');});
app.get(
    '/api/components',
    async (req, res) => {
        try {const result = await pool.query('SELECT * FROM components ORDER BY id');
            res.json(result.rows);
        } catch (error) {
            console.error('Components hatası:', error);
            res.status(500).json({message: 'Component verileri alınırken hata oluştu'});
        }
    }
);
app.get(
    '/api/cause-codes',
    async (req, res) => {
        try {
            const result = await pool.query('SELECT * FROM cause_codes ORDER BY id');
            res.json(result.rows);

        } catch (error) {console.error('Cause codes hatası:', error);

            res.status(500).json({message: 'Cause code verileri alınırken hata oluştu'});
        }
    }
);

app.use(
    '/api/outages',
    outageRoutes
);
app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor`);
});