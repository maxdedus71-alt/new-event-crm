const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ContractorContact = sequelize.define('ContractorContact', {
  fullName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: DataTypes.STRING
}, {
  tableName: 'contractor_contacts'
});

module.exports = ContractorContact;