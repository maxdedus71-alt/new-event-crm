const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrderContractor = sequelize.define('OrderContractor', {
  contractorName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  serviceCost: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0
  },
  commissionPercent: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0
  },
  commissionAmount: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0
  },
  contractorTotal: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0
  },
  paymentStatus: {
    type: DataTypes.ENUM('Оплатить', 'Долг', 'В процессе', 'Оплачено'),
    defaultValue: 'Оплатить'
  }
}, {
  tableName: 'order_contractors'
});

module.exports = OrderContractor;