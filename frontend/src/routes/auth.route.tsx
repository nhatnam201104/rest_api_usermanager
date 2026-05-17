import type { RouteObject } from 'react-router-dom';
import LoginPage from '../pages/auth/login.page';
import RegisterPage from '../pages/auth/register.page';
import VerifyOtpPage from '../pages/auth/verify-otp.page';
import GuestRoute from '../components/common/guest-route';

const AuthRoutes: RouteObject = {
  path: 'auth',
  children: [
    {
      path: 'login',
      element: (
        <GuestRoute>
          <LoginPage />
        </GuestRoute>
      ),
    },
    {
      path: 'register',
      element: (
        <GuestRoute>
          <RegisterPage />
        </GuestRoute>
      ),
    },
    {
      // OTP verification — not wrapped in GuestRoute so authenticated users
      // can still access it if they somehow land here (edge case)
      path: 'verify-otp',
      element: <VerifyOtpPage />,
    },
  ],
};

export default AuthRoutes;
