const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const multiSigRoutes = require('./routes/multisig.routes');
const multiSigModel = require('./models/multisig.model');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 初始化数据库
multiSigModel.createTable();

// 路由
app.use('/api', multiSigRoutes);

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// 启动服务器
app.listen(config.app.port, () => {
  console.log(`Server running on port ${config.app.port}`);
});
