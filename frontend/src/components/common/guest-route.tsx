import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store';
import { hasAccessToken } from '../../libs/auth/token-storage';

interface GuestRouteProps {
  children: React.ReactNode;
}

/**
 * Redirects authenticated users away from public-only pages (login, register).
 * Admins go to /admin, regular users go to /feed.
 */
const GuestRoute = ({ children }: GuestRouteProps) => {
  const { user, isAuthenticated } = useAuthStore();

  if (isAuthenticated && user && hasAccessToken()) {
    if (user.role?.roleName === 'ADMIN') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/feed" replace />;
  }

  return <>{children}</>;
};

export default GuestRoute;
