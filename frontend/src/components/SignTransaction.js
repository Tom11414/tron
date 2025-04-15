import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { signTransaction } from '../services/api';

const SignTransaction = ({ txId, visible, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const result = await signTransaction({
        txId,
        signerAddress: values.signerAddress
      });
      
      message.success('交易签名成功');
      onSuccess(result);
      form.resetFields();
      onClose();
    } catch (error) {
      message.error(`签名失败: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="签名交易"
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} onFinish={handleSubmit}>
        <Form.Item
          name="signerAddress"
          label="签名地址"
          rules={[{ required: true, message: '请输入签名地址' }]}
        >
          <Input placeholder="输入您的地址" />
        </Form.Item>
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit"
            loading={loading}
          >
            确认签名
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SignTransaction;
