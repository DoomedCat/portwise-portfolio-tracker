
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

const Index = () => {
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Navigate to="/auth" replace />;
};

export default Index;
