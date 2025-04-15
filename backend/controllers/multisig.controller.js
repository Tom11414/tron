const multiSigService = require('../services/multisig.service');

class MultiSigController {
  async createAddress(req, res) {
    const { controlAddress } = req.body;
    
    try {
      const { address, privateKey } = await multiSigService.createMultiSigAddress(controlAddress);
      res.json({ 
        success: true, 
        address,
        privateKey,
        message: '多签地址创建成功，请妥善保存私钥' 
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async listAddresses(req, res) {
    try {
      const addresses = await multiSigService.listMultiSigAddresses();
      res.json({ 
        success: true, 
        addresses 
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async createTransaction(req, res) {
    const { fromAddress, toAddress, tokenContract, amount, requiredSignatures } = req.body;
    
    try {
      const { txId, rawTx } = await multiSigService.createMultiSigTransaction(
        fromAddress,
        toAddress,
        tokenContract,
        amount,
        requiredSignatures || 2
      );
      
      res.json({ 
        success: true, 
        txId,
        rawTx,
        message: '交易已创建，等待签名' 
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async signTransaction(req, res) {
    const { txId, signerAddress } = req.body;
    
    try {
      const result = await multiSigService.signTransaction(txId, signerAddress);
      res.json({ 
        success: true, 
        ...result 
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async getTransaction(req, res) {
    const { txId } = req.params;
    
    try {
      const transaction = await multiSigService.getTransactionStatus(txId);
      if (!transaction) {
        return res.status(404).json({ error: '交易不存在' });
      }
      res.json({ 
        success: true, 
        transaction 
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async listPendingTransactions(req, res) {
    try {
      const transactions = await multiSigService.listPendingTransactions();
      res.json({ 
        success: true, 
        transactions 
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new MultiSigController();
