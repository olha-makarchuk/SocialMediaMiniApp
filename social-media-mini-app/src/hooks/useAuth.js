import { useSelector } from 'react-redux';
import { 
  getUser, 
  getAuthLoading, 
  getAuthError, 
  getIsAuthenticated 
} from '../features/auth/authSelectors'; 

export const useAuth = () => {
  const user = useSelector(getUser);
  const isLoading = useSelector(getAuthLoading);
  const error = useSelector(getAuthError);
  const isAuthenticated = useSelector(getIsAuthenticated);

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    isAdmin: user?.role === 'admin',
    displayName: user?.name || user?.username
  };
};