const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ClientContact = sequelize.define('ClientContact', {
  fullName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: DataTypes.STRING,
  socialLink: DataTypes.STRING,
  isPrimary: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'client_contacts'
});

module.exports = ClientContact;