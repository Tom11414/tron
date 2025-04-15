import TronWeb from 'tronweb';

const FULL_NODE = 'https://api.trongrid.io';
const SOLIDITY_NODE = 'https://api.trongrid.io';
const EVENT_SERVER = 'https://api.trongrid.io';

class WalletConnector {
  constructor() {
    this.tronWeb = null;
    this.isConnected = false;
  }

  async connect() {
    return new Promise((resolve, reject) => {
      if (window.tronWeb && window.tronWeb.ready) {
        this.tronWeb = window.tronWeb;
        this.isConnected = true;
        resolve(this.getAccount());
      } else {
        const timer = setInterval(() => {
          if (window.tronWeb && window.tronWeb.ready) {
            clearInterval(timer);
            this.tronWeb = window.tronWeb;
            this.isConnected = true;
            resolve(this.getAccount());
          }
        }, 100);

        setTimeout(() => {
          clearInterval(timer);
          reject(new Error('TronLink not installed or not unlocked'));
        }, 3000);
      }
    });
  }

  getAccount() {
    if (!this.isConnected) return null;
    return this.tronWeb.defaultAddress.base58;
  }

  async signMessage(message) {
    if (!this.isConnected) throw new Error('Wallet not connected');
    return this.tronWeb.trx.signMessage(message);
  }

  async verifySignature(message, signature) {
    if (!this.isConnected) throw new Error('Wallet not connected');
    return this.tronWeb.trx.verifyMessage(message, signature);
  }

  // 备用方案：使用HTTP API
  static getFallbackProvider() {
    return new TronWeb({
      fullHost: FULL_NODE,
      solidityNode: SOLIDITY_NODE,
      eventServer: EVENT_SERVER
    });
  }
}

export default new WalletConnector();
