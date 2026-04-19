const express = require('express');
const router = express.Router();
const controller = require('../controllers/export.controller');

router.get('/clients/excel', controller.exportClientsExcel);
router.get('/clients/csv', controller.exportClientsCsv);
router.get('/contractors/excel', controller.exportContractorsExcel);
router.get('/contractors/csv', controller.exportContractorsCsv);
router.get('/orders/excel', controller.exportOrdersExcel);
router.get('/orders/csv', controller.exportOrdersCsv);

module.exports = router;