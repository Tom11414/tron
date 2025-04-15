require('dotenv').config();

module.exports = {
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'tron_multisig',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  },
  tron: {
    fullHost: process.env.TRON_FULL_HOST || 'https://api.trongrid.io',
    encryptedPrivateKey: process.env.TRON_ENCRYPTED_PRIVATE_KEY // 加密后的私钥
  },
  port: process.env.PORT || 3000,
  encryption: {
    key: process.env.ENCRYPTION_KEY || 'default_encryption_key_32_bytes_long',
    iv: Buffer.alloc(16, 0)
  }
};

