const { Contractor, ContractorContact } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const contractors = await Contractor.findAll({
      include: [{ model: ContractorContact, as: 'contacts' }],
      order: [['createdAt', 'DESC']]
    });
    res.json(contractors);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка загрузки контрагентов', error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { contacts = [], ...data } = req.body;
    const contractor = await Contractor.create(data);

    for (const contact of contacts) {
      await ContractorContact.create({ ...contact, contractorId: contractor.id });
    }

    const result = await Contractor.findByPk(contractor.id, {
      include: [{ model: ContractorContact, as: 'contacts' }]
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка создания контрагента', error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { contacts = [], ...data } = req.body;
    const contractor = await Contractor.findByPk(req.params.id);

    if (!contractor) {
      return res.status(404).json({ message: 'Контрагент не найден' });
    }

    await contractor.update(data);
    await ContractorContact.destroy({ where: { contractorId: contractor.id } });

    for (const contact of contacts) {
      await ContractorContact.create({ ...contact, contractorId: contractor.id });
    }

    const result = await Contractor.findByPk(contractor.id, {
      include: [{ model: ContractorContact, as: 'contacts' }]
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка обновления контрагента', error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const contractor = await Contractor.findByPk(req.params.id);

    if (!contractor) {
      return res.status(404).json({ message: 'Контрагент не найден' });
    }

    await contractor.destroy();
    res.json({ message: 'Контрагент удален' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка удаления контрагента', error: error.message });
  }
};