import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store';
import { hasAccessToken } from '../../libs/auth/token-storage';

type RoleName = 'ADMIN' | 'USER';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** If provided, only users with one of these roles can access the route. */
  allowedRoles?: RoleName[];
}

/**
 * Guards routes that require authentication.
 * Unauthenticated users are redirected to /auth/login.
 * Authenticated users without the required role are redirected to their home.
 */
const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user || !hasAccessToken()) {
    return <Navigate to="/auth/login" replace />;
  }

  const roleName = user.role?.roleName as RoleName | undefined;

  if (allowedRoles && roleName && !allowedRoles.includes(roleName)) {
    return roleName === 'ADMIN'
      ? <Navigate to="/admin" replace />
      : <Navigate to="/feed" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
