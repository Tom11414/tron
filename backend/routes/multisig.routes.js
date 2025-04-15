const express = require('express');
const router = express.Router();
const multiSigController = require('../controllers/multisig.controller');

// 多签地址管理
router.post('/addresses', multiSigController.createAddress);
router.get('/addresses', multiSigController.listAddresses);

// 交易管理
router.post('/transactions', multiSigController.createTransaction);
router.post('/transactions/:txId/sign', multiSigController.signTransaction);
router.get('/transactions/:txId', multiSigController.getTransaction);
router.get('/transactions/pending', multiSigController.listPendingTransactions);

module.exports = router;
