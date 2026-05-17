import type { RouteObject } from 'react-router-dom';
import ClientLayout from '../layouts/client/client.layout';
import LandingPage from '../pages/client/landing.page';
import HomePage from '../pages/client/home.page';
import PostDetailPage from '../pages/client/post-detail.page';
import ProfilePage from '../pages/client/profile.page';
import ProtectedRoute from '../components/common/protected-route';

const ClientRoutes: RouteObject = {
  element: <ClientLayout />,
  children: [
    {
      index: true,
      element: <LandingPage />,
    },
    {
      path: 'feed',
      element: (
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      ),
    },
    {
      path: 'post/:id',
      element: <PostDetailPage />,
    },
    {
      path: 'profile/:userId?',
      element: <ProfilePage />,
    },
  ],
};

export default ClientRoutes;
