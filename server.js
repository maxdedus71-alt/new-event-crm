const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./models');

const ordersRoutes = require('./routes/orders.routes');
const clientsRoutes = require('./routes/clients.routes');
const contractorsRoutes = require('./routes/contractors.routes');
const exportRoutes = require('./routes/export.routes');
const uploadRoutes = require('./routes/upload.routes');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/orders', ordersRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/contractors', contractorsRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/upload', uploadRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Сервер запущен: http://localhost:${PORT}`);
    });
  })
  .catch(error => {
    console.error('Ошибка запуска:', error);
  });