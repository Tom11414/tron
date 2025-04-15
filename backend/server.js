require('dotenv').config();
const express = require('express');
const { sequelize } = require('./backend/models');
const logger = require('./backend/utils/logger');
const http = require('http');

const app = express();
const server = http.createServer(app);

// 中间件配置
app.use(require('cors')({ 
  origin: process.env.FRONTEND_URL || 'http://localhost:3000' 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由注册
app.use('/api', require('./backend/routes'));

// 健康检查
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// 错误处理（必须放在最后）
app.use(require('./backend/middlewares/errorHandler'));

const PORT = process.env.PORT || 3000;

// 数据库连接检查
sequelize.authenticate()
  .then(() => {
    logger.info('Database connection established');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      
      // 启动后台任务
      require('./backend/services/tronMonitor').start();
      require('./backend/services/signatureTracker').start();
    });
  })
  .catch(err => {
    logger.error('Server startup failed:', err);
    process.exit(1);
  });

// 优雅关闭
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully');
  server.close(() => {
    sequelize.close().then(() => process.exit(0));
  });
});
