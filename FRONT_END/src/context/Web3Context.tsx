import React, { useEffect, useState, createContext } from 'react';
import { toast } from 'sonner';
interface Web3ContextType {
  isConnected: boolean;
  address: string | null;
  balance: string | null;
  network: string;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}
export const Web3Context = createContext<Web3ContextType | undefined>(undefined);
export function Web3Provider({ children }: {children: ReactNode;}) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [network, setNetwork] = useState('Ethereum Mainnet');
  const [isConnecting, setIsConnecting] = useState(false);
  // Check if previously connected
  useEffect(() => {
    const storedWallet = localStorage.getItem('votechain_wallet');
    if (storedWallet) {
      setIsConnected(true);
      setAddress(storedWallet);
      setBalance('2.45 ETH');
    }
  }, []);
  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      // Simulate wallet connection delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const mockAddress = '0x7a3B2c1D9e8F4a5B6c7D8e9F0a1B2c3D4e5F6a7B';
      setIsConnected(true);
      setAddress(mockAddress);
      setBalance('2.45 ETH');
      localStorage.setItem('votechain_wallet', mockAddress);
      toast.success('Wallet connected successfully');
    } catch (error) {
      toast.error('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };
  const disconnectWallet = () => {
    setIsConnected(false);
    setAddress(null);
    setBalance(null);
    localStorage.removeItem('votechain_wallet');
    toast.info('Wallet disconnected');
  };
  return (
    <Web3Context.Provider
      value={{
        isConnected,
        address,
        balance,
        network,
        isConnecting,
        connectWallet,
        disconnectWallet
      }}>
      
      {children}
    </Web3Context.Provider>);

}