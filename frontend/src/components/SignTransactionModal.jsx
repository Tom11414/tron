import { Modal, Form, InputNumber, Button, Alert } from 'antd';
import { useState } from 'react';
import api from '../utils/api';

export default function SignTransactionModal({ tx, visible, onClose }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSign = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      const { data } = await api.post(`/transactions/${tx.id}/sign`, {
        signature: values.signature
      });

      onClose(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={`Sign Transaction #${tx.id}`}
      visible={visible}
      onCancel={() => onClose(false)}
      footer={[
        <Button key="cancel" onClick={() => onClose(false)}>
          Cancel
        </Button>,
        <Button 
          key="sign" 
          type="primary" 
          loading={loading}
          onClick={handleSign}
        >
          Sign Transaction
        </Button>
      ]}
    >
      {error && <Alert message={error} type="error" showIcon />}
      
      <Form form={form} layout="vertical">
        <Form.Item
          name="signature"
          label="Your Signature"
          rules={[{ required: true }]}
        >
          <InputNumber 
            style={{ width: '100%' }} 
            placeholder="Enter signature data" 
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
