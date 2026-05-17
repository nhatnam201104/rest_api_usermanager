import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/main.layout';
import AuthRoutes from './auth.route';
import ClientRoutes from './client.route';
import AdminRoutes from './admin.route';

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      AuthRoutes,
      ClientRoutes,
      AdminRoutes,
    ],
  },
]);

export default router;
