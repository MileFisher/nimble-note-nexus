
import { Navigate } from 'react-router-dom';
import Home from './Home';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const { user, isLoading } = useAuth();
  
  // While authenticating, don't redirect yet
  if (isLoading) {
    return null;
  }
  
  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <Home />;
};

export default Index;
