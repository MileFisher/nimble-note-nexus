
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, displayName: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateUser: () => {}
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

// Mock user data for development
const mockUser: User = {
  id: '1',
  email: 'user@example.com',
  displayName: 'Demo User',
  isVerified: false,
  preferences: {
    theme: 'light',
    fontSize: 'medium',
    defaultNoteColor: '#FEF7CD'
  }
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate checking for existing session
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real app, this would check for a token and fetch user data
        // For now, we'll just simulate a delay and set the mock user
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // This would normally be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For demo purposes, accept any credentials
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } finally {
      setIsLoading(false);
    }
  };
  
  const register = async (email: string, displayName: string, password: string) => {
    setIsLoading(true);
    try {
      // This would normally be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newUser: User = {
        ...mockUser,
        email,
        displayName,
        isVerified: false
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };
  
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };
  
  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
