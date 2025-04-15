const TronWeb = require('tronweb');
const logger = require('../utils/logger');
const { HttpProviderError } = require('../errors');

class TronService {
  constructor() {
    this.tronWeb = new TronWeb({
      fullHost: process.env.FULL_NODE,
      solidityNode: process.env.SOLIDITY_NODE,
      eventServer: process.env.EVENT_SERVER,
      headers: { "TRON-PRO-API-KEY": process.env.TRONGRID_API_KEY }
    });
  }

  async validateAddress(address) {
    try {
      return await this.tronWeb.isAddress(address);
    } catch (error) {
      logger.error(`Address validation failed: ${address}`, error);
      throw new HttpProviderError('TRON network error');
    }
  }

  async createMultisig(owners, threshold) {
    try {
      const result = await this.tronWeb.transactionBuilder.createMultiSign(
        owners,
        threshold
      );
      return {
        address: result.address,
        txId: result.txID,
        owners,
        threshold
      };
    } catch (error) {
      logger.error('Multisig creation failed:', error);
      throw new HttpProviderError('Failed to create multisig wallet');
    }
  }

  async sendTransaction(signedTx) {
    try {
      const result = await this.tronWeb.trx.sendRawTransaction(signedTx);
      return {
        txId: result.txid || result.transaction.txID,
        confirmed: !!result.result
      };
    } catch (error) {
      logger.error('Transaction broadcast failed:', error);
      throw new HttpProviderError('Failed to broadcast transaction');
    }
  }
}

module.exports = new TronService();
