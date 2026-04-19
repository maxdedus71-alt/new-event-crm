const express = require('express');
const multer = require('multer');
const path = require('path');
const controller = require('../controllers/upload.controller');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post('/order-document', upload.single('file'), controller.uploadOrderDocument);

module.exports = router;