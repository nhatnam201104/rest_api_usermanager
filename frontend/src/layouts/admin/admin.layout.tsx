import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './admin.sidebar';
import AdminHeader from './admin.header';

const AdminLayout = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setOpenSidebar(true);
      } else {
        setOpenSidebar(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setOpenSidebar(!openSidebar);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div
        className={`fixed lg:sticky top-0 left-0 h-screen z-40 transition-all duration-300 ${
          isMobile
            ? openSidebar
              ? 'translate-x-0'
              : '-translate-x-full'
            : openSidebar
            ? 'translate-x-0 w-64'
            : '-translate-x-64 w-0'
        }`}
      >
        <AdminSidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader toggleSidebar={toggleSidebar} openSidebar={openSidebar} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

      {isMobile && openSidebar && (
        <div
          className="fixed inset-0 bg-black/60 z-30 backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default AdminLayout;
