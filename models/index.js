const sequelize = require('../config/database');
const Client = require('./client');
const ClientContact = require('./clientContact');
const Contractor = require('./contractor');
const ContractorContact = require('./contractorContact');
const Order = require('./order');
const OrderContractor = require('./orderContractor');
const OrderDocument = require('./orderDocument');

Client.hasMany(ClientContact, { foreignKey: 'clientId', as: 'contacts', onDelete: 'CASCADE' });
ClientContact.belongsTo(Client, { foreignKey: 'clientId' });

Contractor.hasMany(ContractorContact, { foreignKey: 'contractorId', as: 'contacts', onDelete: 'CASCADE' });
ContractorContact.belongsTo(Contractor, { foreignKey: 'contractorId' });

Client.hasMany(Order, { foreignKey: 'clientId', as: 'orders' });
Order.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });

Order.hasMany(OrderContractor, { foreignKey: 'orderId', as: 'contractors', onDelete: 'CASCADE' });
OrderContractor.belongsTo(Order, { foreignKey: 'orderId' });

Contractor.hasMany(OrderContractor, { foreignKey: 'contractorId', as: 'orderLinks' });
OrderContractor.belongsTo(Contractor, { foreignKey: 'contractorId', as: 'contractor' });

Order.hasMany(OrderDocument, { foreignKey: 'orderId', as: 'documents', onDelete: 'CASCADE' });
OrderDocument.belongsTo(Order, { foreignKey: 'orderId' });

module.exports = {
  sequelize,
  Client,
  ClientContact,
  Contractor,
  ContractorContact,
  Order,
  OrderContractor,
  OrderDocument
};