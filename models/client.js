const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Client = sequelize.define('Client', {
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subcategory1: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subcategory2: {
    type: DataTypes.STRING,
    allowNull: true
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  inn: DataTypes.STRING,
  ogrn: DataTypes.STRING,
  bik: DataTypes.STRING,
  kpp: DataTypes.STRING,
  okpo: DataTypes.STRING,
  checkingAccount: DataTypes.STRING,
  correspondentAccount: DataTypes.STRING,
  directorName: DataTypes.STRING,
  legalAddress: DataTypes.STRING,
  officeAddress: DataTypes.STRING,
  bankName: DataTypes.STRING,
  website: DataTypes.STRING,
  phone: DataTypes.STRING,
  email: DataTypes.STRING,
  comment: DataTypes.TEXT
}, {
  tableName: 'clients'
});

module.exports = Client;