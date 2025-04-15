import React, { useState, useEffect } from 'react';
import { Table, Button, message } from 'antd';
import { listPendingTransactions, getTransaction } from '../services/api';

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: '交易ID',
      dataIndex: 'tx_id',
      key: 'tx_id',
      render: (text) => <span style={{ fontFamily: 'monospace' }}>{text}</span>
    },
    {
      title: '源地址',
      dataIndex: 'from_address',
      key: 'from_address',
      render: (text) => <span style={{ fontFamily: 'monospace' }}>{text}</span>
    },
    {
      title: '目标地址',
      dataIndex: 'to_address',
      key: 'to_address',
      render: (text) => <span style={{ fontFamily: 'monospace' }}>{text}</span>
    },
    {
      title: '代币合约',
      dataIndex: 'token_contract',
      key: 'token_contract',
      render: (text) => <span style={{ fontFamily: 'monospace' }}>{text}</span>
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount'
    },
    {
      title: '签名状态',
      key: 'signatures',
      render: (_, record) => (
        <span>{record.current_signatures}/{record.required_signatures}</span>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="link" 
          onClick={() => handleViewDetails(record.tx_id)}
        >
          查看详情
        </Button>
      )
    }
  ];

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const result = await listPendingTransactions();
      setTransactions(result.transactions);
    } catch (error) {
      message.error('获取交易列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (txId) => {
    try {
      const result = await getTransaction(txId);
      console.log('Transaction details:', result);
      // 这里可以打开一个模态框显示交易详情
      message.info(`查看交易 ${txId} 的详情`);
    } catch (error) {
      message.error('获取交易详情失败');
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div>
      <Table 
        columns={columns} 
        dataSource={transactions} 
        rowKey="tx_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default TransactionList;
