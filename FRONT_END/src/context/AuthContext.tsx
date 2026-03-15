import React, { useEffect, useState, createContext } from 'react';
import { toast } from 'sonner';
import { ethers } from 'ethers';
import { api } from '../api';
import { useWeb3 } from '../hooks/useWeb3';

interface User {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  walletAddress?: string;
  avatar?: string;
  joinedAt?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (walletAddress: string, privateKey: string) => Promise<void>;
  logout: () => void;
  register: (data: { name: string, email: string }) => Promise<void>;
  updateProfile: (name: string, email: string) => Promise<void>;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: {children: React.ReactNode;}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { address, privateKey, disconnectWallet } = useWeb3();

  // Check sessionStorage on mount (per-tab, no sharing between tabs)
  useEffect(() => {
    const checkAuth = async () => {
      const storedAuth = sessionStorage.getItem('votechain_auth_token');
      if (storedAuth) {
        setIsAuthenticated(true);
        try {
          const res = await api.get('/auth/profile');
          setUser(res.data);
        } catch(e) {
          console.error('Failed to restore profile', e);
          setIsAuthenticated(false);
          sessionStorage.removeItem('votechain_auth_token');
          disconnectWallet();
        }
      } else {
        disconnectWallet();
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const updateProfile = async (name: string, email: string) => {
    try {
      console.log(`[AuthContext] Calling updateProfile API for name: "${name}", email: "${email}"`);
      const response = await api.put('/auth/profile', { name, email });
      console.log('[AuthContext] Update response received:', response.data);
      setUser(response.data);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('[AuthContext] Update API error:', error.response?.data || error.message);
      toast.error('Failed to update profile');
      throw error;
    }
  };

  const login = async (walletAddress: string, privateKey: string) => {
    setIsLoading(true);
    try {
      console.log(`[Auth Flow] Bước 1: Bắt đầu quá trình login cho địa chỉ: ${walletAddress}`);

      // Bước 2: Gọi API lấy message (nonce)
      console.log('[Auth Flow] Bước 2: Gọi API lấy nonce từ Server...');
      const responseMsg = await api.post('/auth/request-message', { walletAddress });
      const messageToSign = responseMsg.data.message;
      console.log(`[Auth Flow] Đã lấy message: "${messageToSign}"`);

      // Bước 3: Sử dụng ethers để ký message qua Private Key
      console.log('[Auth Flow] Bước 3: Đang ký message bằng Private Key...');
      const wallet = new ethers.Wallet(privateKey);
      
      const signature = await wallet.signMessage(messageToSign);
      console.log('[Auth Flow] Đã xuất signature:', signature);

      // Bước 4: Gửi message & signature lên Server để lấy Token
      console.log('[Auth Flow] Bước 4: Gửi signature xác thực...');
      const authRes = await api.post('/auth/verify-signature', {
        message: messageToSign,
        signature: signature
      });

      // Bước 5: Lưu Token, kết thúc
      const { token, user: userData } = authRes.data;
      console.log('[Auth Flow] Bước 5: Nhận Token thành công:', token);

      sessionStorage.setItem('votechain_auth_token', token);
      setIsAuthenticated(true);
      setUser(userData);
      toast.success('Successfully logged in');

    } catch (error: any) {
      console.error('[Auth Error]', error);
      toast.error(error.response?.data?.error || error.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    sessionStorage.removeItem('votechain_auth_token');
    disconnectWallet();
    toast.info('Logged out successfully');
  };

  const register = async (data: { name: string, email: string }) => {
    setIsLoading(true);
    try {
      console.log('[AuthContext] Bắt đầu quá trình Register...');
      
      // Step 1: Login if not authenticated
      if (!isAuthenticated) {
        if (!address || !privateKey) {
          throw new Error('Wallet not connected. Please connect your wallet first.');
        }
        await login(address, privateKey);
      }
      
      // Step 2: Update Profile
      await updateProfile(data.name, data.email);
      
      toast.success('Account created and profile updated!');
    } catch (error: any) {
      console.error('[AuthContext] Register error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        register,
        updateProfile,
        isLoading
      }}>
      {children}
    </AuthContext.Provider>
  );
}