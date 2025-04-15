import { useState, useEffect } from 'react';
import { Button, message } from 'antd';
import TronWeb from 'tronweb';

export default function WalletConnector({ onConnected }) {
  const [address, setAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      if (!window.tronWeb) {
        throw new Error('TronLink extension not detected');
      }

      const res = await window.tronWeb.request({ method: 'tron_requestAccounts' });
      const addr = window.tronWeb.defaultAddress.base58;
      
      if (!addr) throw new Error('No authorized account found');
      
      setAddress(addr);
      onConnected(addr);
      message.success(`Connected: ${addr.substring(0, 10)}...`);
    } catch (err) {
      message.error(err.message);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Button 
      type="primary" 
      onClick={handleConnect}
      loading={isConnecting}
    >
      {address ? `Connected: ${address.substring(0, 6)}...` : 'Connect Wallet'}
    </Button>
  );
}
