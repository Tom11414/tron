const crypto = require('crypto');
const config = require('../config/config');

const algorithm = 'aes-256-cbc';
const key = crypto.scryptSync(config.encryption.key, 'salt', 32);
const iv = config.encryption.iv;

function encrypt(text) {
  if (!text) return null;
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decrypt(encrypted) {
  if (!encrypted) return null;
  try {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    console.error('Decryption failed:', err);
    return null;
  }
}

module.exports = { encrypt, decrypt };
