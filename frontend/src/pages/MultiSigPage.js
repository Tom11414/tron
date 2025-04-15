import React, { useState } from 'react';
import { Button, Space, Card } from 'antd';
import CreateTransaction from '../components/CreateTransaction';
import TransactionList from '../components/TransactionList';
import SignTransaction from '../components/SignTransaction';
import TransactionDetail from '../components/TransactionDetail';

const MultiSigPage = () => {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [signModalVisible, setSignModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedTxId, setSelectedTxId] = useState(null);
  const [selectedTx, setSelectedTx] = useState(null);

  const handleCreateSuccess = () => {
    setCreateModalVisible(false);
  };

  const handleSignSuccess = () => {
    setSignModalVisible(false);
  };

  const handleViewDetails = async (txId) => {
    setSelectedTxId(txId);
    setDetailModalVisible(true);
    // 这里可以调用API获取交易详情并设置selectedTx
  };

  return (
    <div className="page-container">
      <Card
        title="多签交易管理"
        extra={
          <Space>
            <Button 
              type="primary" 
              onClick={() => setCreateModalVisible(true)}
            >
              创建交易
            </Button>
          </Space>
        }
      >
        <TransactionList onViewDetails={handleViewDetails} />
      </Card>

      <CreateTransaction
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onSuccess={handleCreateSuccess}
      />

      <SignTransaction
        txId={selectedTxId}
        visible={signModalVisible}
        onClose={() => setSignModalVisible(false)}
        onSuccess={handleSignSuccess}
      />

      <TransactionDetail
        transaction={selectedTx}
        visible={detailModalVisible}
        onClose={() => setDetailModalVisible(false)}
      />
    </div>
  );
};

export default MultiSigPage;
