const { Sequelize } = require('sequelize');
const config = require('../config/config');
const logger = require('../utils/logger');

const sequelize = new Sequelize(config.db.name, config.db.user, config.db.password, {
  host: config.db.host,
  port: config.db.port,
  dialect: 'postgres',
  logging: msg => logger.debug(msg),
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const models = {
  Wallet: require('./wallet')(sequelize),
  Transaction: require('./transaction')(sequelize),
  Signature: require('./signature')(sequelize)
};

// 建立关联
Object.values(models).forEach(model => {
  if (model.associate) model.associate(models);
});

module.exports = {
  ...models,
  sequelize
};
