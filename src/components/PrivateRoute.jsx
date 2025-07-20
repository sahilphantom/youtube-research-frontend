import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children, requireSubscription = false, requireAdmin = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Check basic authentication
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check admin access
  if (requireAdmin && !user.isAdmin) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // Check subscription access
  if (requireSubscription && (!user.isSubscribed || user.subscriptionStatus !== 'active')) {
    return <Navigate to="/pricing" state={{ from: location }} replace />;
  }

  return children;
} 