const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  orderNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  managerName: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Менеджер'
  },
  createdAtManual: {
    type: DataTypes.DATE,
    allowNull: false
  },
  eventDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  eventStartTime: {
    type: DataTypes.STRING,
    allowNull: false
  },
  eventEndTime: {
    type: DataTypes.STRING,
    allowNull: false
  },
  comment: DataTypes.TEXT,
  extraCharge: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0
  },
  totalContractorExpenses: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0
  },
  totalCommission: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0
  },
  clientTotal: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0
  },
  taxAmount: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0
  },
  netProfit: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('Выполнен', 'В работе', 'Жду подтверждения', 'Заказ', 'Отменен'),
    defaultValue: 'Заказ'
  },
  paymentConfirmed: {
    type: DataTypes.ENUM('да', 'нет'),
    defaultValue: 'нет'
  },
  isArchived: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'orders'
});

module.exports = Order;