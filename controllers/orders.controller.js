const { Order, OrderContractor, Client, OrderDocument } = require('../models');
const { calculateOrderTotals } = require('../services/order.service');

function generateOrderNumber() {
  const now = new Date();
  return `ORD-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Date.now()}`;
}

exports.getAll = async (req, res) => {
  try {
    const where = {};
    if (req.query.archived === 'true') where.isArchived = true;
    if (req.query.archived === 'false') where.isArchived = false;
    if (req.query.status) where.status = req.query.status;
    if (req.query.clientId) where.clientId = req.query.clientId;
    if (req.query.managerName) where.managerName = req.query.managerName;
    if (req.query.paymentConfirmed) where.paymentConfirmed = req.query.paymentConfirmed;

    const orders = await Order.findAll({
      where,
      include: [
        { model: Client, as: 'client' },
        { model: OrderContractor, as: 'contractors' },
        { model: OrderDocument, as: 'documents' }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка загрузки заказов', error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const {
      managerName,
      clientId,
      eventDate,
      eventStartTime,
      eventEndTime,
      comment,
      extraCharge,
      status,
      paymentConfirmed,
      contractors
    } = req.body;

    const result = calculateOrderTotals(contractors || [], extraCharge);

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      managerName: managerName || 'Менеджер',
      createdAtManual: new Date(),
      clientId,
      eventDate,
      eventStartTime,
      eventEndTime,
      comment,
      extraCharge: result.totals.extraCharge,
      totalContractorExpenses: result.totals.totalContractorExpenses,
      totalCommission: result.totals.totalCommission,
      clientTotal: result.totals.clientTotal,
      taxAmount: result.totals.taxAmount,
      netProfit: result.totals.netProfit,
      status,
      paymentConfirmed
    });

    if (result.contractors.length) {
      await Promise.all(
        result.contractors.map(item =>
          OrderContractor.create({
            orderId: order.id,
            contractorId: item.contractorId || null,
            contractorName: item.contractorName,
            serviceCost: item.serviceCost,
            commissionPercent: item.commissionPercent,
            commissionAmount: item.commissionAmount,
            contractorTotal: item.contractorTotal,
            paymentStatus: item.paymentStatus || 'Оплатить'
          })
        )
      );
    }

    const createdOrder = await Order.findByPk(order.id, {
      include: [
        { model: Client, as: 'client' },
        { model: OrderContractor, as: 'contractors' },
        { model: OrderDocument, as: 'documents' }
      ]
    });

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка создания заказа', error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ message: 'Заказ не найден' });
    }

    const {
      managerName,
      clientId,
      eventDate,
      eventStartTime,
      eventEndTime,
      comment,
      extraCharge,
      status,
      paymentConfirmed,
      contractors
    } = req.body;

    const result = calculateOrderTotals(contractors || [], extraCharge);

    await order.update({
      managerName,
      clientId,
      eventDate,
      eventStartTime,
      eventEndTime,
      comment,
      extraCharge: result.totals.extraCharge,
      totalContractorExpenses: result.totals.totalContractorExpenses,
      totalCommission: result.totals.totalCommission,
      clientTotal: result.totals.clientTotal,
      taxAmount: result.totals.taxAmount,
      netProfit: result.totals.netProfit,
      status,
      paymentConfirmed
    });

    await OrderContractor.destroy({ where: { orderId: id } });

    if (result.contractors.length) {
      await Promise.all(
        result.contractors.map(item =>
          OrderContractor.create({
            orderId: order.id,
            contractorId: item.contractorId || null,
            contractorName: item.contractorName,
            serviceCost: item.serviceCost,
            commissionPercent: item.commissionPercent,
            commissionAmount: item.commissionAmount,
            contractorTotal: item.contractorTotal,
            paymentStatus: item.paymentStatus || 'Оплатить'
          })
        )
      );
    }

    const updatedOrder = await Order.findByPk(order.id, {
      include: [
        { model: Client, as: 'client' },
        { model: OrderContractor, as: 'contractors' },
        { model: OrderDocument, as: 'documents' }
      ]
    });

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка обновления заказа', error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const id = req.params.id;
    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ message: 'Заказ не найден' });
    }

    await order.destroy();
    res.json({ message: 'Заказ удален' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка удаления заказа', error: error.message });
  }
};

exports.archive = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Заказ не найден' });
    }

    await order.update({ isArchived: true });
    res.json({ message: 'Заказ отправлен в архив' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка архивирования', error: error.message });
  }
};