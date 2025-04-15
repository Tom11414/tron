const request = require('supertest');
const app = require('../server');
const { MultisigWallet } = require('../models');
const { mockTronWeb } = require('./helpers');

describe('Multisig API', () => {
  beforeAll(async () => {
    await MultisigWallet.sync({ force: true });
  });

  describe('POST /api/wallets', () => {
    it('should create a new multisig wallet', async () => {
      const response = await request(app)
        .post('/api/wallets')
        .send({
          owners: ['TRON_ADDRESS_1', 'TRON_ADDRESS_2'],
          threshold: 2,
          name: 'Test Wallet'
        })
        .expect(201);

      expect(response.body).toHaveProperty('address');
      expect(response.body.threshold).toBe(2);
    });

    it('should reject invalid threshold', async () => {
      await request(app)
        .post('/api/wallets')
        .send({
          owners: ['TRON_ADDRESS_1'],
          threshold: 3, // 超过owner数量
          name: 'Invalid Wallet'
        })
        .expect(400);
    });
  });

  describe('POST /api/transactions', () => {
    let wallet;

    beforeEach(async () => {
      wallet = await MultisigWallet.create({
        address: mockTronWeb.generateAddress(),
        owners: ['TRON_ADDRESS_1', 'TRON_ADDRESS_2', 'TRON_ADDRESS_3'],
        threshold: 2
      });
    });

    it('should create a transaction', async () => {
      const response = await request(app)
        .post('/api/transactions')
        .send({
          walletId: wallet.id,
          to: 'TRON_RECIPIENT_ADDRESS',
          value: '1000000',
          data: '0x'
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.status).toBe('pending');
    });
  });
});
