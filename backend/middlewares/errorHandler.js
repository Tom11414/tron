const { logError } = require('../utils/logger');

module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  // 记录完整错误信息
  logError({
    message: err.message,
    stack: err.stack,
    method: req.method,
    path: req.path,
    params: req.params,
    body: req.body
  });

  // 生产环境隐藏敏感信息
  const response = {
    status: 'error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  };

  // 特殊处理验证错误
  if (err.name === 'ValidationError') {
    response.message = 'Validation failed';
    response.errors = err.errors;
  }

  res.status(statusCode).json(response);
};
