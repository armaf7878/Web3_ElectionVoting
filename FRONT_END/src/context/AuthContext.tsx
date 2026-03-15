import React, { useEffect, useState, createContext } from 'react';
import { MOCK_USER } from '../utils/constants';
import { toast } from 'sonner';
interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinedAt: string;
}
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: () => Promise<void>;
  logout: () => void;
  register: (data: Partial<User>) => Promise<void>;
  isLoading: boolean;
}
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function AuthProvider({ children }: {children: ReactNode;}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Simulate checking local storage on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem('votechain_auth');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
      setUser(MOCK_USER);
    }
    setIsLoading(false);
  }, []);
  const login = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsAuthenticated(true);
    setUser(MOCK_USER);
    localStorage.setItem('votechain_auth', 'true');
    setIsLoading(false);
    toast.success('Successfully logged in');
  };
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('votechain_auth');
    toast.info('Logged out successfully');
  };
  const register = async (data: Partial<User>) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsAuthenticated(true);
    setUser({
      ...MOCK_USER,
      ...data,
      id: `usr_${Math.random().toString(36).substr(2, 9)}`
    });
    localStorage.setItem('votechain_auth', 'true');
    setIsLoading(false);
    toast.success('Account created successfully!');
  };
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        register,
        isLoading
      }}>
      
      {children}
    </AuthContext.Provider>);

}