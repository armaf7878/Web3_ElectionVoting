import React, { useEffect, useState, createContext } from 'react';
import { toast } from 'sonner';

import { ethers } from 'ethers';

interface Web3ContextType {
  isConnected: boolean;
  address: string | null;
  balance: string | null;
  network: string;
  isConnecting: boolean;
  privateKey: string | null;
  connectWallet: (pk: string) => Promise<void>;
  disconnectWallet: () => void;
}

export const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function Web3Provider({ children }: {children: React.ReactNode;}) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const network = 'Ethereum Network';
  const [isConnecting, setIsConnecting] = useState(false);
  const [privateKey, setPrivateKey] = useState<string | null>(null);

  // Check if previously connected - uses sessionStorage for per-tab isolation
  useEffect(() => {
    const storedWallet = sessionStorage.getItem('votechain_wallet');
    const storedPk = sessionStorage.getItem('votechain_pk');
    if (storedWallet && storedPk) {
      setIsConnected(true);
      setAddress(storedWallet);
      setPrivateKey(storedPk);
    }
  }, []);

  const connectWallet = async (pk: string) => {
    setIsConnecting(true);
    try {
      if (!pk) {
        throw new Error('Please enter a valid private key.');
      }

      console.log('[Web3Context] Connecting via manual Private Key...');
      const wallet = new ethers.Wallet(pk);
      const userAddress = wallet.address;
      
      console.log('[Web3Context] Đã kết nối với địa chỉ ví:', userAddress);

      setIsConnected(true);
      setAddress(userAddress);
      setPrivateKey(pk);

      sessionStorage.setItem('votechain_wallet', userAddress);
      sessionStorage.setItem('votechain_pk', pk);
      toast.success('Wallet connected successfully via Private Key');
    } catch (error: any) {
      console.error('[Web3Context Error]', error);
      toast.error(error.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    if (isConnected) {
      setIsConnected(false);
      setAddress(null);
      setBalance(null);
      setPrivateKey(null);
      sessionStorage.removeItem('votechain_wallet');
      sessionStorage.removeItem('votechain_pk');
      toast.info('Wallet disconnected');
    }
  };

  return (
    <Web3Context.Provider
      value={{
        isConnected,
        address,
        balance,
        network,
        isConnecting,
        privateKey,
        connectWallet,
        disconnectWallet
      }}>
      {children}
    </Web3Context.Provider>
  );
}