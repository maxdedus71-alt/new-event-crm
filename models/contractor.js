const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Contractor = sequelize.define('Contractor', {
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
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: DataTypes.STRING,
  serviceCost: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0
  },
  socialLink: DataTypes.STRING,
  website1: DataTypes.STRING,
  website2: DataTypes.STRING,
  comment: DataTypes.TEXT,
  rating: {
    type: DataTypes.INTEGER,
    defaultValue: 5
  }
}, {
  tableName: 'contractors'
});

module.exports = Contractor;