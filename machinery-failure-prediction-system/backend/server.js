const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db');
const machineRoutes = require('./routes/machineRoutes');
const predictionRoutes = require('./routes/predictionRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());
app.get('/api/health', async (req, res) => {
  try {
    await db.query('SELECT 1');

    res.json({
      status: 'ok',
      database: 'connected'
    });

  } catch (e) {

    console.error('DATABASE ERROR:', e);

    res.status(503).json({
      status: 'error',
      database: 'disconnected',
      error: e.message
    });
  }
});
app.use('/api/machines', machineRoutes);
app.use('/api/predictions', predictionRoutes);
app.use(errorHandler);

const port = Number(process.env.PORT || 5000);
app.get('/', (req, res) => {
  res.json({
    service: 'Machinery Failure Prediction API',
    status: 'running'
  });
});
app.listen(port, () => console.log(`Backend running on http://localhost:${port}`));
