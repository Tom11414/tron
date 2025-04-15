import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Button, message, Spin } from 'antd';
import { createTransaction, listAddresses } from '../services/api';

const { Option } = Select;

const CreateTransaction = ({ visible, onClose, onSuccess }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // 获取可用地址列表
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoading(true);
        const result = await listAddresses();
        setAddresses(result.addresses || []);
      } catch (error) {
        console.error('获取地址失败:', error);
        message.error('获取地址列表失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };
    
    if (visible) {
      fetchAddresses();
    }
  }, [visible]);

  // 重置表单
  useEffect(() => {
    if (!visible) {
      form.resetFields();
    }
  }, [visible, form]);

  // 提交表单
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      
      // 验证金额是否为有效数字
      if (isNaN(parseFloat(values.amount)) {
        throw new Error('请输入有效的金额');
      }

      // 验证签名数是否为有效整数
      if (!Number.isInteger(Number(values.requiredSignatures)) || 
          Number(values.requiredSignatures) <= 0) {
        throw new Error('所需签名数必须是正整数');
      }

      // 调用API创建交易
      const response = await createTransaction({
        fromAddress: values.fromAddress,
        toAddress: values.toAddress,
        tokenContract: values.tokenContract,
        amount: values.amount.toString(),
        requiredSignatures: parseInt(values.requiredSignatures, 10)
      });

      message.success('交易创建成功！');
      onSuccess(response.transaction);
      onClose();
    } catch (error) {
      console.error('创建交易失败:', error);
      message.error(`创建交易失败: ${error.message || '未知错误'}`);
    } finally {
      setLoading(false);
    }
  };

  // 表单验证规则
  const formRules = {
    fromAddress: [{ required: true, message: '请选择源地址' }],
    toAddress: [
      { required: true, message: '请输入目标地址' },
      { pattern: /^T[a-zA-Z0-9]{33}$/, message: '请输入有效的TRON地址' }
    ],
    tokenContract: [
      { required: true, message: '请输入代币合约地址' },
      { pattern: /^T[a-zA-Z0-9]{33}$/, message: '请输入有效的合约地址' }
    ],
    amount: [
      { required: true, message: '请输入金额' },
      { pattern: /^[0-9]+(\.[0-9]+)?$/, message: '请输入有效数字' }
    ],
    requiredSignatures: [
      { required: true, message: '请输入所需签名数' },
      { pattern: /^[1-9]\d*$/, message: '必须为正整数' }
    ]
  };

  return (
    <Modal
      title="创建多签交易"
      visible={visible}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      width={600}
    >
      <Spin spinning={loading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            requiredSignatures: 2
          }}
        >
          <Form.Item
            name="fromAddress"
            label="源地址"
            rules={formRules.fromAddress}
          >
            <Select
              placeholder="选择多签地址"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {addresses.map((address) => (
                <Option 
                  key={address.address} 
                  value={address.address}
                >
                  {address.address} 
                  {address.name && ` (${address.name})`}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="toAddress"
            label="目标地址"
            rules={formRules.toAddress}
          >
            <Input 
              placeholder="输入接收方TRON地址 (以T开头)" 
              allowClear
            />
          </Form.Item>

          <Form.Item
            name="tokenContract"
            label="代币合约地址"
            rules={formRules.tokenContract}
          >
            <Input 
              placeholder="输入TRC20代币合约地址 (以T开头)" 
              allowClear
            />
          </Form.Item>

          <Form.Item
            name="amount"
            label="转账金额"
            rules={formRules.amount}
          >
            <Input 
              type="text" 
              placeholder="输入转账金额" 
              addonAfter="代币单位"
            />
          </Form.Item>

          <Form.Item
            name="requiredSignatures"
            label="所需签名数"
            rules={formRules.requiredSignatures}
          >
            <Input 
              type="number" 
              placeholder="输入需要多少个签名才能执行" 
              min={1}
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit"
              loading={loading}
              block
              size="large"
            >
              创建交易
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default CreateTransaction;
