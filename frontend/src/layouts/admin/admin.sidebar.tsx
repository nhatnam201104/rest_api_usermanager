import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { path: '/admin', label: 'Dashboard', icon: '📊' },
  { path: '/admin/users', label: 'Quan ly nguoi dung', icon: '👥' },
  { path: '/admin/posts', label: 'Duyet bai viet', icon: '📝' },
];

const AdminSidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 h-full bg-gray-900 text-white flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminSidebar;
