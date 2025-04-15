const TronWeb = require('tronweb');
const { decrypt } = require('../utils/encryption');
const config = require('../config/config');
const multiSigModel = require('../models/multisig.model');

class MultiSigService {
  constructor() {
    this.tronWeb = new TronWeb({
      fullHost: config.tron.fullHost,
      privateKey: decrypt(config.tron.encryptedPrivateKey)
    });
  }

  async createMultiSigAddress(controlAddress) {
    const account = await this.tronWeb.createAccount();
    const multiSigAddress = account.address.base58;
    
    await multiSigModel.createMultiSigAddress(multiSigAddress, controlAddress);
    
    return {
      address: multiSigAddress,
      privateKey: account.privateKey
    };
  }

  async createMultiSigTransaction(fromAddress, toAddress, tokenContract, amount, requiredSignatures) {
    const isMultiSig = await multiSigModel.isMultiSigAddress(fromAddress);
    if (!isMultiSig) {
      throw new Error('源地址不是多签地址');
    }

    let tx;
    if (tokenContract === 'TRX') {
      tx = await this.tronWeb.transactionBuilder.sendTrx(toAddress, amount, fromAddress);
    } else {
      tx = await this.tronWeb.transactionBuilder.triggerSmartContract(
        tokenContract,
        'transfer(address,uint256)',
        {
          feeLimit: 100000000,
          callValue: 0
        },
        [
          {type: 'address', value: toAddress},
          {type: 'uint256', value: amount}
        ],
        fromAddress
      );
    }

    const txId = tx.txID;
    await multiSigModel.createPendingTransaction({
      tx_id: txId,
      from_address: fromAddress,
      to_address: toAddress,
      token_contract: tokenContract,
      amount: amount,
      required_signatures: requiredSignatures
    });

    return {
      txId,
      rawTx: JSON.stringify(tx)
    };
  }

  async signTransaction(txId, signerAddress) {
    const pendingTx = await multiSigModel.getPendingTransaction(txId);
    if (!pendingTx) {
      throw new Error('交易不存在');
    }

    const hasSigned = await multiSigModel.hasSigned(txId, signerAddress);
    if (hasSigned) {
      throw new Error('您已经签署过此交易');
    }

    const tx = await this.tronWeb.trx.getTransaction(txId);
    if (!tx) {
      throw new Error('获取交易失败');
    }

    const signedTx = await this.tronWeb.trx.sign(tx, signerAddress);
    const signature = signedTx.signature[0];

    await multiSigModel.addSignature({
      tx_id: txId,
      signer_address: signerAddress,
      signature: signature
    });

    const newCount = await multiSigModel.incrementSignatureCount(txId);
    
    if (newCount >= pendingTx.required_signatures) {
      const result = await this.tronWeb.trx.sendRawTransaction(signedTx);
      await multiSigModel.updateTransactionStatus(txId, 'approved');
      return { 
        status: 'approved',
        result 
      };
    }

    return { 
      status: 'pending',
      signatures: newCount,
      required: pendingTx.required_signatures
    };
  }

  async getTransactionStatus(txId) {
    return await multiSigModel.getTransactionWithSignatures(txId);
  }

  async listMultiSigAddresses() {
    return await multiSigModel.listMultiSigAddresses();
  }

  async listPendingTransactions() {
    return await multiSigModel.listPendingTransactions();
  }
}

module.exports = new MultiSigService();
