
import { useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Notes from '@/components/notes/Notes';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

const Home = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <MainLayout>
      {!user.isVerified && (
        <Alert className="mb-4 bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-950/20 dark:border-orange-900 dark:text-orange-300">
          <AlertDescription>
            Your email is not verified. Please check your inbox for a verification link.
          </AlertDescription>
        </Alert>
      )}
      <Notes />
    </MainLayout>
  );
};

export default Home;
