const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrderDocument = sequelize.define('OrderDocument', {
  fileName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'order_documents'
});

module.exports = OrderDocument;