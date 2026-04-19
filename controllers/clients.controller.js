const { Client, ClientContact } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const clients = await Client.findAll({
      include: [{ model: ClientContact, as: 'contacts' }],
      order: [['createdAt', 'DESC']]
    });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка загрузки клиентов', error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { contacts = [], ...data } = req.body;
    const client = await Client.create(data);

    for (const contact of contacts) {
      await ClientContact.create({ ...contact, clientId: client.id });
    }

    const result = await Client.findByPk(client.id, {
      include: [{ model: ClientContact, as: 'contacts' }]
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка создания клиента', error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { contacts = [], ...data } = req.body;
    const client = await Client.findByPk(req.params.id);

    if (!client) {
      return res.status(404).json({ message: 'Клиент не найден' });
    }

    await client.update(data);
    await ClientContact.destroy({ where: { clientId: client.id } });

    for (const contact of contacts) {
      await ClientContact.create({ ...contact, clientId: client.id });
    }

    const result = await Client.findByPk(client.id, {
      include: [{ model: ClientContact, as: 'contacts' }]
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка обновления клиента', error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);

    if (!client) {
      return res.status(404).json({ message: 'Клиент не найден' });
    }

    await client.destroy();
    res.json({ message: 'Клиент удален' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка удаления клиента', error: error.message });
  }
};