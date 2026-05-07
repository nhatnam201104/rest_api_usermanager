import { Outlet, useLocation } from 'react-router-dom';
import ClientHeader from './client.header';
import ClientFooter from './client.footer';

const ClientLayout = () => {
  const location = useLocation();
  const isLanding = location.pathname === '/';
  // Feed page manages its own full-height layout — no footer needed
  const isFeed = location.pathname === '/feed';

  return (
    <div className="flex flex-col min-h-screen" style={{ background: '#0a0a1a' }}>
      <ClientHeader />
      <main className="flex-grow">
        <Outlet />
      </main>
      {!isLanding && !isFeed && <ClientFooter />}
    </div>
  );
};

export default ClientLayout;
