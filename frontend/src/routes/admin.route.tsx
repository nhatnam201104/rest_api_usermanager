import type { RouteObject } from "react-router-dom";
import AdminLayout from "../layouts/admin/admin.layout";
import ProtectedRoute from "../components/common/protected-route";
import DashboardPage from "../pages/admin/dashboard.page";
import UserManagementPage from "../pages/admin/user-management.page";
import PostModerationPage from "../pages/admin/post-moderation.page";

const AdminRoutes: RouteObject = {
  path: "admin",
  element: (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <AdminLayout />
    </ProtectedRoute>
  ),
  children: [
    {
      index: true,
      element: <DashboardPage />,
    },
    {
      path: "dashboard",
      element: <DashboardPage />,
    },
    {
      path: "users",
      element: <UserManagementPage />,
    },
    {
      path: "posts",
      element: <PostModerationPage />,
    },
  ],
};

export default AdminRoutes;
