const mysql = require('mysql2/promise');
const config = require('../config/config');

async function initializeDatabase() {
  const connection = await mysql.createConnection({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS ${config.db.database}`);
  console.log(`Database ${config.db.database} created or already exists`);

  const pool = mysql.createPool(config.db);
  
  await pool.query(`
    CREATE TABLE IF NOT EXISTS multi_sign_addresses (
      id INT AUTO_INCREMENT PRIMARY KEY,
      address VARCHAR(34) NOT NULL,
      control_address VARCHAR(34) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY (address)
    )
  `);
  
  await pool.query(`
    CREATE TABLE IF NOT EXISTS pending_transactions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      tx_id VARCHAR(64) NOT NULL,
      from_address VARCHAR(34) NOT NULL,
      to_address VARCHAR(34) NOT NULL,
      token_contract VARCHAR(34) NOT NULL,
      amount DECIMAL(36, 18) NOT NULL,
      status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
      required_signatures INT NOT NULL,
      current_signatures INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  
  await pool.query(`
    CREATE TABLE IF NOT EXISTS transaction_signatures (
      id INT AUTO_INCREMENT PRIMARY KEY,
      tx_id VARCHAR(64) NOT NULL,
      signer_address VARCHAR(34) NOT NULL,
      signature VARCHAR(256) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY (tx_id, signer_address)
    )
  `);

  console.log('All tables created successfully');
  process.exit(0);
}

initializeDatabase().catch(err => {
  console.error('Database initialization failed:', err);
  process.exit(1);
});
