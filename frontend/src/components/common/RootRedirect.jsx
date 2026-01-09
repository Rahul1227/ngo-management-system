import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Home from '../../pages/Home';

const RootRedirect = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  // If this is NOT the initial page load, allow Home
  if (location.key !== 'default') {
    return <Home />;
  }

  // Initial website load
  if (user) {
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/user/dashboard" replace />;
  }

  return <Home />;
};

export default RootRedirect;
