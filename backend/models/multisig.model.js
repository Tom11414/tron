const mysql = require('mysql2/promise');
const config = require('../config/config');
const { encrypt, decrypt } = require('../utils/encryption');

class MultiSigModel {
  constructor() {
    this.pool = mysql.createPool(config.db);
  }

  async createMultiSigAddress(address, controlAddress) {
    const query = `
      INSERT INTO multi_sign_addresses 
      (address, control_address)
      VALUES (?, ?)
    `;
    await this.pool.query(query, [address, controlAddress]);
  }

  async listMultiSigAddresses() {
    const [rows] = await this.pool.query(
      'SELECT * FROM multi_sign_addresses ORDER BY created_at DESC'
    );
    return rows;
  }

  async isMultiSigAddress(address) {
    const [rows] = await this.pool.query(
      'SELECT 1 FROM multi_sign_addresses WHERE address = ? LIMIT 1',
      [address]
    );
    return rows.length > 0;
  }

  async createPendingTransaction(data) {
    const query = `
      INSERT INTO pending_transactions 
      (tx_id, from_address, to_address, token_contract, amount, required_signatures)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await this.pool.query(query, [
      data.tx_id,
      data.from_address,
      data.to_address,
      data.token_contract,
      data.amount,
      data.required_signatures
    ]);
  }

  async getPendingTransaction(txId) {
    const [rows] = await this.pool.query(
      'SELECT * FROM pending_transactions WHERE tx_id = ?',
      [txId]
    );
    return rows[0];
  }

  async hasSigned(txId, signerAddress) {
    const [rows] = await this.pool.query(
      'SELECT 1 FROM transaction_signatures WHERE tx_id = ? AND signer_address = ? LIMIT 1',
      [txId, signerAddress]
    );
    return rows.length > 0;
  }

  async addSignature(data) {
    const query = `
      INSERT INTO transaction_signatures 
      (tx_id, signer_address, signature)
      VALUES (?, ?, ?)
    `;
    await this.pool.query(query, [
      data.tx_id,
      data.signer_address,
      data.signature
    ]);
  }

  async incrementSignatureCount(txId) {
    await this.pool.query(
      'UPDATE pending_transactions SET current_signatures = current_signatures + 1 WHERE tx_id = ?',
      [txId]
    );
    const [tx] = await this.pool.query(
      'SELECT current_signatures FROM pending_transactions WHERE tx_id = ?',
      [txId]
    );
    return tx[0].current_signatures;
  }

  async updateTransactionStatus(txId, status) {
    await this.pool.query(
      'UPDATE pending_transactions SET status = ? WHERE tx_id = ?',
      [status, txId]
    );
  }

  async getTransactionWithSignatures(txId) {
    const [tx] = await this.pool.query(
      'SELECT * FROM pending_transactions WHERE tx_id = ?',
      [txId]
    );
    
    if (!tx[0]) return null;
    
    const [signatures] = await this.pool.query(
      'SELECT * FROM transaction_signatures WHERE tx_id = ?',
      [txId]
    );
    
    return {
      ...tx[0],
      signatures
    };
  }

  async listPendingTransactions() {
    const [rows] = await this.pool.query(
      'SELECT * FROM pending_transactions WHERE status = "pending" ORDER BY created_at DESC'
    );
    return rows;
  }
}

module.exports = new MultiSigModel();
