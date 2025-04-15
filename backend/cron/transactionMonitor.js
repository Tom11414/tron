const cron = require('node-cron');
const { Transaction } = require('../models');
const logger = require('../utils/logger');
const tronWeb = require('../utils/tronWeb');

class TransactionMonitor {
  constructor() {
    this.isRunning = false;
  }

  start() {
    // 每5分钟检查一次pending交易
    cron.schedule('*/5 * * * *', async () => {
      if (this.isRunning) return;
      
      try {
        this.isRunning = true;
        const pendingTxs = await Transaction.findAll({
          where: { status: 'pending' }
        });

        for (const tx of pendingTxs) {
          try {
            const txInfo = await tronWeb.trx.getTransactionInfo(tx.txHash);
            
            if (txInfo.receipt && txInfo.receipt.result === 'SUCCESS') {
              await tx.update({ status: 'executed' });
              logger.info(`Transaction ${tx.id} confirmed`);
            } else if (txInfo.receipt && txInfo.receipt.result === 'FAILED') {
              await tx.update({ status: 'rejected' });
              logger.warn(`Transaction ${tx.id} failed`);
            }
          } catch (error) {
            logger.error(`Error checking tx ${tx.id}: ${error.message}`);
          }
        }
      } catch (error) {
        logger.error(`Monitor error: ${error.message}`);
      } finally {
        this.isRunning = false;
      }
    });
  }
}

module.exports = new TransactionMonitor();
