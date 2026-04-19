const { Client, Contractor, Order } = require('../models');
const { exportToExcel, exportToCsv } = require('../services/export.service');

exports.exportClientsExcel = async (req, res) => {
  const clients = await Client.findAll({ raw: true });
  await exportToExcel(res, clients, 'Клиенты', 'clients');
};

exports.exportClientsCsv = async (req, res) => {
  const clients = await Client.findAll({ raw: true });
  exportToCsv(res, clients, 'clients');
};

exports.exportContractorsExcel = async (req, res) => {
  const contractors = await Contractor.findAll({ raw: true });
  await exportToExcel(res, contractors, 'Контрагенты', 'contractors');
};

exports.exportContractorsCsv = async (req, res) => {
  const contractors = await Contractor.findAll({ raw: true });
  exportToCsv(res, contractors, 'contractors');
};

exports.exportOrdersExcel = async (req, res) => {
  const orders = await Order.findAll({ raw: true });
  await exportToExcel(res, orders, 'Заказы', 'orders');
};

exports.exportOrdersCsv = async (req, res) => {
  const orders = await Order.findAll({ raw: true });
  exportToCsv(res, orders, 'orders');
};