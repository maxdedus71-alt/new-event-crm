const { OrderDocument } = require('../models');

exports.uploadOrderDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Файл не загружен' });
    }

    const document = await OrderDocument.create({
      orderId: req.body.orderId,
      fileName: req.file.originalname,
      filePath: `/uploads/${req.file.filename}`
    });

    res.status(201).json(document);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка загрузки файла', error: error.message });
  }
};