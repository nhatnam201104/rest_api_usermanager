import { useAuthStore } from '../../stores/auth.store';

interface AdminHeaderProps {
  toggleSidebar: () => void;
  openSidebar: boolean;
}

const AdminHeader = ({ toggleSidebar }: AdminHeaderProps) => {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    void logout();
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
          >
            ☰
          </button>
          <h2 className="text-lg font-semibold text-gray-800">
            Xin chao, {user?.fullName || 'Admin'}
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user?.email}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Dang xuat
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
