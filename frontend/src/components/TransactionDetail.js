import React from 'react';
import { Modal, Descriptions, Tag } from 'antd';

const TransactionDetail = ({ transaction, visible, onClose }) => {
  if (!transaction) return null;

  return (
    <Modal
      title="交易详情"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label="交易ID">
          {transaction.tx_id}
        </Descriptions.Item>
        <Descriptions.Item label="源地址">
          {transaction.from_address}
        </Descriptions.Item>
        <Descriptions.Item label="目标地址">
          {transaction.to_address}
        </Descriptions.Item>
        <Descriptions.Item label="代币合约">
          {transaction.token_contract}
        </Descriptions.Item>
        <Descriptions.Item label="金额">
          {transaction.amount}
        </Descriptions.Item>
        <Descriptions.Item label="状态">
          <Tag color={transaction.status === 'approved' ? 'green' : 'orange'}>
            {transaction.status === 'approved' ? '已执行' : '待签名'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="签名进度">
          {transaction.current_signatures}/{transaction.required_signatures}
        </Descriptions.Item>
        <Descriptions.Item label="签名列表">
          {transaction.signatures && transaction.signatures.length > 0 ? (
            <ul>
              {transaction.signatures.map((sig, index) => (
                <li key={index}>{sig.signer_address}</li>
              ))}
            </ul>
          ) : (
            '暂无签名'
          )}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default TransactionDetail;
