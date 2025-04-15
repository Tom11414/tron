import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// 响应拦截器
api.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response) {
      const message = error.response.data?.error || '请求失败';
      return Promise.reject(new Error(message));
    } else if (error.request) {
      return Promise.reject(new Error('网络错误，请检查连接'));
    } else {
      return Promise.reject(error);
    }
  }
);

// 多签地址API
export const listAddresses = () => api.get('/multisig/addresses');
export const createAddress = (data) => api.post('/multisig/addresses', data);

// 交易API
export const listPendingTransactions = () => api.get('/multisig/transactions/pending');
export const createTransaction = (data) => api.post('/multisig/transactions', data);
export const getTransaction = (txId) => api.get(`/multisig/transactions/${txId}`);
export const signTransaction = (data) => api.post(`/multisig/transactions/${data.txId}/sign`, data);

// 用户认证API
export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);
export const getProfile = () => api.get('/auth/profile');
